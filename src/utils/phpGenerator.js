// src/utils/phpGenerator.js

export function generatePHPCode(jsonData) {
    console.log("=== DEBUG ===");
    console.log("Classes:", jsonData.classes);
    console.log("Relations:", jsonData.relationships);
    console.log("============");
    
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
                   // Correction ici pour le return
            if (method.returnType !== 'void') {
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
                } else {
                    phpCode += `        return null;\n`;
                }
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


// Gérer les relations
if (jsonData.relationships  && Array.isArray(jsonData.relationships)) {
    jsonData.relationships.forEach(relation => {
        if (!relation || !relation.type) {
            console.warn('Invalid relationship data');
            return;
        }
        const sourceClass = jsonData.classes.find(c => c.id === relation.sourceClass);
        const targetClass = jsonData.classes.find(c => c.id === relation.targetClass);

        if (!sourceClass || !targetClass) {
            console.warn('Missing source or target class for relationship');
            return;
        }
            try {
                const cardinalityComment = relation.sourceCardinality && relation.targetCardinality ? 
                    ` // ${relation.sourceCardinality} -> ${relation.targetCardinality}` : '';

                switch (relation.type) {
                    case 'inheritance': {
    try {
        const sourceClass = jsonData.classes.find(c => c.id === relation.sourceClass);
        const targetClass = jsonData.classes.find(c => c.id === relation.targetClass);
        
        if (!sourceClass || !targetClass) {
            console.error('Classes non trouvées pour l\'héritage');
            return;
        }

        // Préparer le nouveau code pour la classe fille avec une indentation correcte
        const newClassCode = `class ${sourceClass.className} extends ${targetClass.className} { // ${relation.sourceCardinality} -> ${relation.targetCardinality}
    // Attributes
    public string $${sourceClass.attributes[0]?.name};

    // Constructor
    public function __construct($${sourceClass.attributes[0]?.name} = null, $${targetClass.attributes[0]?.name} = null) {
        parent::__construct($${targetClass.attributes[0]?.name}); // Appel du constructeur parent
        $this->${sourceClass.attributes[0]?.name} = $${sourceClass.attributes[0]?.name};
    }

    // Getters
    public function get${capitalizeFirst(sourceClass.attributes[0]?.name)}() {
        return $this->${sourceClass.attributes[0]?.name};
    }

    // Setters
    public function set${capitalizeFirst(sourceClass.attributes[0]?.name)}($${sourceClass.attributes[0]?.name}) {
        $this->${sourceClass.attributes[0]?.name} = $${sourceClass.attributes[0]?.name};
        return $this;
    }

    public function ${sourceClass.methods[0]?.name}: ${sourceClass.methods[0]?.returnType} {
        // TODO: Implement ${sourceClass.methods[0]?.name}
        ${sourceClass.methods[0]?.returnType === 'void' ? '' : 'return 0;'}
    }

    // toString method
    public function __toString() {
        $parentData = json_decode(parent::__toString(), true);
        return json_encode(array_merge($parentData, [
            '${sourceClass.attributes[0]?.name}' => $this->${sourceClass.attributes[0]?.name},
        ]));
    }
}`;

        // Remplacer complètement l'ancienne classe
        const oldClassPattern = new RegExp(`class ${sourceClass.className}[^{]*{[\\s\\S]*?\\n}`);
        phpCode = phpCode.replace(oldClassPattern, newClassCode);

        console.log('Héritage ajouté avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'héritage:', error);
    }
    break;
}
                        case 'implementation': {
                            try {
                                // Vérifier que l'interface existe
                                const interfaceClass = jsonData.classes.find(c => c.id === relation.targetClass);
                                const implementingClass = jsonData.classes.find(c => c.id === relation.sourceClass);
                        
                                if (!interfaceClass || !implementingClass) {
                                    console.error('Interface ou classe non trouvée');
                                    return;
                                }
                        
                                // Ajouter le mot-clé "implements"
                                const classPattern = `class ${implementingClass.className} {`;
                                const implementsCode = `class ${implementingClass.className} implements ${interfaceClass.className} {`;
                                
                                // Générer le code pour les méthodes de l'interface
                                let interfaceMethods = '';
                                interfaceClass.methods.forEach(method => {
                                    const methodName = method.name.replace('()', '');
                                    const returnType = method.returnType ? `: ${convertTypeToPhp(method.returnType)}` : '';
                                    
                                interfaceMethods += `
    // Implémentation de la méthode de l'interface
    public function ${methodName}()${returnType} {
    // TODO: Implement ${methodName}
    `;
                                    // Ajouter une valeur de retour par défaut selon le type
                                    if (method.returnType === 'string') {
                                        interfaceMethods += `        return "";\n`;
                                    } else if (method.returnType === 'int' || method.returnType === 'integer') {
                                        interfaceMethods += `        return 0;\n`;
                                    } else if (method.returnType === 'bool' || method.returnType === 'boolean') {
                                        interfaceMethods += `        return false;\n`;
                                    } else if (method.returnType === 'array') {
                                        interfaceMethods += `        return [];\n`;
                                    } else if (method.returnType === 'float' || method.returnType === 'double') {
                                        interfaceMethods += `        return 0.0;\n`;
                                    } else if (method.returnType !== 'void') {
                                        interfaceMethods += `        return null;\n`;
                                    }
                                    interfaceMethods += `    }\n\n`;
                                });
                        
                                // Ajouter l'implémentation et les méthodes
                                phpCode = phpCode.replace(
                                    classPattern, 
                                    implementsCode + interfaceMethods
                                );
                        
                                console.log('Implémentation ajoutée avec succès');
                            } catch (error) {
                                console.error('Erreur lors de l\'ajout de l\'implémentation:', error);
                            }
                            break;
                        }

                        case 'unidirectionnelle': {
                            try {
                                // Vérifier que les classes existent
                                if (!sourceClass || !targetClass) {
                                    console.error('Classes manquantes pour la relation unidirectionnelle');
                                    break;
                                }
                        
                                // Log pour déboguer
                                console.log('Relation:', {
                                    type: 'unidirectionnelle',
                                    source: sourceClass.className,
                                    target: targetClass.className,
                                    sourceCardinality: relation.sourceCardinality,
                                    targetCardinality: relation.targetCardinality
                                });
                        
                                // Préparer le code de la relation
                                const targetClassName = targetClass.className.trim();
                                const propertyName = targetClassName.toLowerCase();
                                const relationCode = `
                            // Relation unidirectionnelle
                            private array $${propertyName}s = []; // ${relation.sourceCardinality} -> ${relation.targetCardinality}
                        
                            public function add${targetClassName}($${propertyName}) {
                                $this->${propertyName}s[] = $${propertyName};
                            }
                        
                            public function get${targetClassName}s() {
                                return $this->${propertyName}s;
                            }
                        
                        `;
                        
                                // Trouver et remplacer dans la classe source
                        const sourceClassStart = `class ${sourceClass.className.trim()} {`;
                        const sourceClassReplacement = sourceClassStart + relationCode;
                        
                                // Effectuer le remplacement
                        phpCode = phpCode.split(sourceClassStart).join(sourceClassReplacement);
                        
                                console.log('Relation unidirectionnelle ajoutée avec succès');
                        
                            } catch (error) {
                                console.error('Erreur lors de l\'ajout de la relation unidirectionnelle:', error);
                            }
                            break;
                        }
                        
                        case 'bidirectionnelle': {
                            try {
                                if (!sourceClass || !targetClass) {
                                    console.error('Classes manquantes pour la relation bidirectionnelle');
                                    return;
                                }
                        
                                // Log pour déboguer
                                console.log('Relation:', {
                                    type: 'bidirectionnelle',
                                    source: sourceClass.className,
                                    target: targetClass.className,
                                    sourceCardinality: relation.sourceCardinality,
                                    targetCardinality: relation.targetCardinality
                                });
                        
                                // Code pour MaClasse1
                                const sourceClassPattern = new RegExp(`class ${sourceClass.className} {`);
                                const sourceClassReplacement = `class ${sourceClass.className} {
                            // Relation bidirectionnelle
                            private array $${targetClass.className.toLowerCase()}s = []; // ${relation.sourceCardinality} -> ${relation.targetCardinality}
                        
                            public function add${targetClass.className}($${targetClass.className.toLowerCase()}) {
                                $this->${targetClass.className.toLowerCase()}s[] = $${targetClass.className.toLowerCase()};
                                $${targetClass.className.toLowerCase()}->add${sourceClass.className}($this);
                            }
                        
                            public function get${targetClass.className}s() {
                                return $this->${targetClass.className.toLowerCase()}s;
                            }
                        
                        `;
                        
                                // Code pour MaClasse2
                                const targetClassPattern = new RegExp(`${targetClass.type === 'umlAbstractClass' ? 'abstract ' : ''}class ${targetClass.className} {`);
                                const targetClassReplacement = `${targetClass.type === 'umlAbstractClass' ? 'abstract ' : ''}class ${targetClass.className} {
                            // Relation bidirectionnelle
                            private array $${sourceClass.className.toLowerCase()}s = []; // ${relation.targetCardinality} -> ${relation.sourceCardinality}
                        
                            public function add${sourceClass.className}($${sourceClass.className.toLowerCase()}) {
                                $this->${sourceClass.className.toLowerCase()}s[] = $${sourceClass.className.toLowerCase()};
                            }
                        
                            public function get${sourceClass.className}s() {
                                return $this->${sourceClass.className.toLowerCase()}s;
                            }
                        
                        `;
                        
                                // Effectuer les remplacements
                                phpCode = phpCode.replace(sourceClassPattern, sourceClassReplacement);
                                phpCode = phpCode.replace(targetClassPattern, targetClassReplacement);
                        
                                console.log('Relation bidirectionnelle ajoutée avec succès');
                        
                            } catch (error) {
                                console.error('Erreur lors de l\'ajout de la relation:', error);
                                console.log('Source:', sourceClass?.className);
                                console.log('Target:', targetClass?.className);
                            }
                            break;
                        }
                        


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
    );
}

    phpCode += "?>\n";
    return phpCode;
}

// Fonction utilitaire pour capitaliser la première lettre
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}