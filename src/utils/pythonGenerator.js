export function generatePythonCode(jsonData) {
    if (!jsonData || !jsonData.classes) {
        throw new Error('Invalid JSON data structure');
    }
    
    let pythonCode = '';

    // Fonction utilitaire pour convertir les types
    function convertTypeToPython(type) {
        switch(type.toLowerCase()) {
            case 'string':
            case 'String':
                return 'str';
            case 'boolean':
            case 'Boolean':
                return 'bool';
            case 'integer':
            case 'Integer':
                return 'int';
            case 'double':
            case 'Double':
            case 'float':
            case 'Float':
                return 'float';
            case 'list':
            case 'List':
                return 'list';
            case 'dict':
            case 'Dict':
                return 'dict';
            default:
                return type;
        }
    }

    // Trier les classes pour que les interfaces soient générées en premier
    const sortedClasses = [...jsonData.classes].sort((a, b) => {
        if (a.type === 'umlInterface') return -1;
        if (b.type === 'umlInterface') return 1;
        return 0;
    });

    // 1. Générer le code pour chaque classe
    jsonData.classes.forEach(classData => {
        // Déterminer le type de classe (class, interface -> ABC, abstract class)
        const isInterface = classData.type === 'umlInterface';
        const isAbstract = classData.type === 'umlAbstractClass';

        // Imports nécessaires
        if (isInterface || isAbstract) {
            pythonCode += "from abc import ABC, abstractmethod\n\n";
        }

        // Début de la déclaration de classe
        pythonCode += `class ${classData.className}`;
        
        // Ajouter les relations d'héritage
        let inheritance = [];
        if (isInterface || isAbstract) {
            inheritance.push('ABC');
        }
        if (classData.extends) {
            inheritance.push(classData.extends);
        }
        if (classData.implements) {
            inheritance.push(classData.implements);
        }
        
        if (inheritance.length > 0) {
            pythonCode += `(${inheritance.join(', ')})`;
        }
        
        pythonCode += ":\n";

        // Docstring de la classe
        pythonCode += '    """';
        pythonCode += `\n    ${classData.className} class`;
        if (isInterface) {
            pythonCode += ' (Interface)';
        } else if (isAbstract) {
            pythonCode += ' (Abstract)';
        }
        pythonCode += '\n    """\n\n';

        // Constructeur
        if (!isInterface && classData.attributes && classData.attributes.length > 0) {
            pythonCode += "    def __init__(self";
            
            // Paramètres du constructeur
            classData.attributes.forEach(attr => {
                const pythonType = convertTypeToPython(attr.type);
                pythonCode += `, ${attr.name}: ${pythonType} = None`;
            });
            
            pythonCode += "):\n";
            
            // Corps du constructeur
            classData.attributes.forEach(attr => {
                pythonCode += `        self._${attr.name} = ${attr.name}\n`;
            });
            pythonCode += "\n";
        }

         // Properties pour les attributs (seulement pour les classes non-interface)
         if (!isInterface && classData.attributes && classData.attributes.length > 0) {
            classData.attributes.forEach(attr => {
                const pythonType = convertTypeToPython(attr.type);
                
                // Getter
                pythonCode += `    @property\n`;
                pythonCode += `    def ${attr.name}(self) -> ${pythonType}:\n`;
                pythonCode += `        """Get ${attr.name} value"""\n`;
                pythonCode += `        return self._${attr.name}\n\n`;

                // Setter
                pythonCode += `    @${attr.name}.setter\n`;
                pythonCode += `    def ${attr.name}(self, value: ${pythonType}):\n`;
                pythonCode += `        """Set ${attr.name} value"""\n`;
                pythonCode += `        self._${attr.name} = value\n\n`;
            });
        }

        // Méthodes
        if (classData.methods && classData.methods.length > 0) {
            classData.methods.forEach(method => {
                const methodName = method.name.replace('()', '');
                const returnType = convertTypeToPython(method.returnType || 'None');
                const decorator = (isInterface || method.isAbstract) ? '    @abstractmethod\n' : '';
                
                  if (isInterface || isAbstract || method.isAbstract) {
                    pythonCode += '    @abstractmethod\n';
                    pythonCode += `    def ${methodName}(self) -> ${returnType}:\n`;
                    pythonCode += '        """Abstract method"""\n';
                    pythonCode += '        pass\n\n';
                }else {
                    // Vérifier si la classe implémente une interface
                    const implementedInterface = jsonData.classes.find(c => 
                        c.type === 'umlInterface' && classData.implements === c.className
                    );

                    // Si la classe implémente une interface, ajouter toutes les méthodes de l'interface
                    if (implementedInterface) {
                        implementedInterface.methods.forEach(interfaceMethod => {
                            const interfaceMethodName = interfaceMethod.name.replace('()', '');
                            if (!classData.methods.find(m => m.name.replace('()', '') === interfaceMethodName)) {
                                pythonCode += `    def ${interfaceMethodName}(self) -> ${convertTypeToPython(interfaceMethod.returnType)}:\n`;
                                pythonCode += `        """Implementation of abstract method"""\n`;
                                pythonCode += `        return ${getDefaultReturnValue(interfaceMethod.returnType)}\n\n`;
                            }
                        });
                    }

                    pythonCode += `    def ${methodName}(self) -> ${returnType}:\n`;
                    pythonCode += `        """TODO: Implement ${methodName}"""\n`;
                    pythonCode += `        return ${getDefaultReturnValue(returnType)}\n\n`;
                }
    });
 }

        // Méthode __str__ (seulement pour les classes non-interface)
        if (!isInterface) {
            pythonCode += "    def __str__(self) -> str:\n";
            pythonCode += '        """String representation of the object"""\n';
            pythonCode += "        return str({\n";
            if (classData.attributes) {
                classData.attributes.forEach(attr => {
                    pythonCode += `            "${attr.name}": self._${attr.name},\n`;
                });
            }
            pythonCode += "        })\n\n";
        }

        pythonCode += "\n";
    });

    // Gérer les relations
    if (jsonData.relationships && Array.isArray(jsonData.relationships)) {
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

            // Les relations sont déjà gérées via l'héritage et les attributs de classe
        });
    }

    return pythonCode;
}


// Fonction pour obtenir la valeur de retour par défaut
function getDefaultReturnValue(type) {
    if (!type) return 'None';
    switch(type.toLowerCase()) {
        case 'void':
        case 'none':
            return 'None';
        case 'bool':
        case 'boolean':
            return 'False';
        case 'int':
        case 'integer':
            return '0';
        case 'float':
        case 'double':
            return '0.0';
        case 'str':
        case 'string':
            return '""';
        case 'list':
            return '[]';
        case 'dict':
            return '{}';
        default:
            return 'None';
    }
}