// src/utils/phpGenerator.js

export function generatePHPCode(jsonData) {
    let phpCode = "<?php\n\n";

    // Fonction utilitaire pour convertir les types
    function convertTypeToPhp(type) {
        switch(type.toLowerCase()) {
            case 'string':
            case 'String':
                return 'string';
            case 'boolean':
            case 'Boolean':
                return 'bool';
            case 'integer':
            case 'Integer':
                return 'int';
            case 'double':
            case 'Double':
                return 'float';
            default:
                return type.toLowerCase();
        }
    }

    // 1. Générer le code pour chaque classe
    jsonData.classes.forEach(classData => {
        // Déterminer le type de classe (class, interface, abstract class)
        const classType = classData.type === 'umlInterface' ? 'interface' : 
                         classData.type === 'umlAbstractClass' ? 'abstract class' : 
                         'class';

        // Début de la déclaration de classe
        phpCode += `${classType} ${classData.className}`;
        
        // Ajouter les relations d'héritage/implémentation si elles existent
        if (classData.extends) {
            phpCode += ` extends ${classData.extends}`;
        }
        if (classData.implements) {
            phpCode += ` implements ${classData.implements}`;
        }
        phpCode += " {\n\n";


        // Gestion des attributs avec visibilité
        if (classData.attributes && classData.attributes.length > 0) {
            phpCode += "    // Attributes\n";
            classData.attributes.forEach(attr => {
                const visibility = attr.visibility === '+' ? 'public' : 
                                 attr.visibility === '-' ? 'private' : 
                                 'protected';
                const type = attr.type ? convertTypeToPhp(attr.type) + ' ' : '';
                phpCode += `    ${visibility} ${type}$${attr.name};\n`;
            });
            phpCode += "\n";
        }

         // 2. Constructeur
         if (classType !== 'interface') {
            phpCode += "    // Constructor\n";
            phpCode += `    public function __construct(`;
                    
            // Paramètres du constructeur basés sur les attributs
            const constructorParams = classData.attributes
                .map(attr => `$${attr.name} = null`)
                .join(', ');
                    
            phpCode += `${constructorParams}) {\n`;
                    
            // Corps du constructeur
            classData.attributes.forEach(attr => {
                phpCode += `        $this->${attr.name} = $${attr.name};\n`;
                });
                phpCode += "    }\n\n";
        }

        // 3. Getters
        if (classType !== 'interface' && classData.attributes.length > 0) {
            phpCode += "    // Getters\n";
             classData.attributes.forEach(attr => {
                phpCode += `    public function get${capitalizeFirst(attr.name)}() {\n`;
                phpCode += `        return $this->${attr.name};\n`;
                 phpCode += "    }\n\n";
            });
        }

        // 4. Setters
        if (classType !== 'interface' && classData.attributes.length > 0) {
            phpCode += "    // Setters\n";
            classData.attributes.forEach(attr => {
                phpCode += `    public function set${capitalizeFirst(attr.name)}($${attr.name}) {\n`;
                phpCode += `        $this->${attr.name} = $${attr.name};\n`;
                phpCode += "        return $this;\n";
                phpCode += "    }\n\n";
            });
        }
        

          // 5. Méthodes personnalisées
          classData.methods.forEach(method => {
            const visibility = method.visibility === '+' ? 'public' : 
                             method.visibility === '-' ? 'private' : 
                             'protected';
            
            const methodName = method.name.replace('()', '');
            const returnType = method.returnType ? `: ${convertTypeToPhp(method.returnType)}` : '';
            
            if (classType === 'interface') {
                phpCode += `    ${visibility} function ${methodName}()${returnType};\n\n`;
            } else {
                const isAbstract = classType === 'abstract class' && method.isAbstract ? 'abstract ' : '';
                
                if (isAbstract) {
                    phpCode += `    ${isAbstract}${visibility} function ${methodName}()${returnType};\n\n`;
                } else {
                    phpCode += `    ${visibility} function ${methodName}()${returnType} {\n`;
                    phpCode += `        // TODO: Implement ${methodName}\n`;
                    if (method.returnType === 'bool' || method.returnType === 'boolean') {
                        phpCode += `        return false;\n`;
                    } else if (method.returnType === 'int') {
                        phpCode += `        return 0;\n`;
                    } else if (method.returnType === 'string') {
                        phpCode += `        return "";\n`;
                    } else if (method.returnType === 'float' || method.returnType === 'double') {
                        phpCode += `        return 0.0;\n`;
                    } else if (method.returnType === 'array') {
                        phpCode += `        return [];\n`;
                    } else if (method.returnType !== 'void') {
                        phpCode += `        return null;\n`;
                    }
                    phpCode += "    }\n\n";
                }
            }    
        });

        // 6. toString() method
        if (classType !== 'interface') {
            phpCode += "    // toString method\n";
            phpCode += "    public function __toString() {\n";
            phpCode += "        return json_encode([\n";
            classData.attributes.forEach(attr => {
                phpCode += `            '${attr.name}' => $this->${attr.name},\n`;
            });
            phpCode += "        ]);\n";
            phpCode += "    }\n\n";
        }

        phpCode += "}\n\n";
    });


  
    // Dans phpGenerator.js

// Gérer les relations
if (jsonData.relationships && jsonData.relationships.length > 0) {
    jsonData.relationships.forEach(relation => {
        const sourceClass = jsonData.classes.find(c => c.id === relation.sourceClass);
        const targetClass = jsonData.classes.find(c => c.id === relation.targetClass);

        if (sourceClass && targetClass) {
            try {
                const cardinalityComment = relation.sourceCardinality && relation.targetCardinality ? 
                    ` // ${relation.sourceCardinality} -> ${relation.targetCardinality}` : '';

                switch (relation.type) {
                    case 'inheritance':
                        // Gérer l'héritage avec cardinalité
                        phpCode = phpCode.replace(
                            `class ${sourceClass.className.trim()} {`,
                            `class ${sourceClass.className.trim()} extends ${targetClass.className.trim()}${cardinalityComment} {`
                        );
                        break;

                        case 'implementation':
                            // Gérer l'implémentation sans cardinalité
                            phpCode = phpCode.replace(
                                `class ${sourceClass.className.trim()} {`,
                                `class ${sourceClass.className.trim()} implements ${targetClass.className.trim()} {`
                            );
                        break;

                    case 'unidirectionnelle':
                    case 'bidirectionnelle':
                    case 'aggregation':
                    case 'composition':
                        const propertyName = targetClass.className.toLowerCase().trim();
                        
                        // Gérer la cardinalité pour toutes les relations
                        if (relation.targetCardinality === '0..*' || relation.targetCardinality === '*') {
                            // Pour les relations multiples
                            const collectionProperty = `
    private array $${propertyName}s = []; // ${relation.type}${cardinalityComment}

    public function add${targetClass.className.trim()}($${propertyName}) {
        $this->${propertyName}s[] = $${propertyName};
    }

    public function get${targetClass.className.trim()}s() {
        return $this->${propertyName}s;
    }
`;
                            phpCode = phpCode.replace(
                                `class ${sourceClass.className.trim()} {`,
                                `class ${sourceClass.className.trim()} {${collectionProperty}`
                            );
                        } else {
                            // Pour les relations simples
                            phpCode = phpCode.replace(
                                `class ${sourceClass.className.trim()} {`,
                                `class ${sourceClass.className.trim()} {
                        private ${targetClass.className.trim()} $${propertyName}; // ${relation.type}${cardinalityComment}\n`
                            );
                        }

                        // Si c'est une relation bidirectionnelle, ajouter aussi la relation inverse
                        if (relation.type === 'bidirectionnelle') {
                            const inversePropertyName = sourceClass.className.toLowerCase().trim();
                            phpCode = phpCode.replace(
                                `class ${targetClass.className.trim()} {`,
                                `class ${targetClass.className.trim()} {
                                private ${sourceClass.className.trim()} $${inversePropertyName}; // ${relation.type}${cardinalityComment}\n`
                            );
                        }
                        break;
                }
            } catch (error) {
                console.error('Error processing relationship:', error);
                console.log('Source:', sourceClass?.className);
                console.log('Target:', targetClass?.className);
                console.log('Type:', relation.type);
            }
        }
    });
}

    phpCode += "?>\n";
    return phpCode;
}

// Fonction utilitaire pour capitaliser la première lettre
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}