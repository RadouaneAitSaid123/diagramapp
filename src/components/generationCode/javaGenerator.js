// src/components/generationCode/javaGenerator.js

export const generateJavaFiles = (nodes, edges) => {
    console.log("Initial nodes:", nodes);
    console.log("Initial edges:", edges);

    // Créer un map des IDs vers les noms de classes
    const classNameMap = {};
    nodes.forEach(node => {
        if (node && node.data && node.data.className) {
            classNameMap[node.id] = node.data.className;
            console.log(`Adding to classNameMap: ${node.id} -> ${node.data.className}`);
        }
    });
    console.log("ClassNameMap:", classNameMap);

    // Fonction pour générer les getters
    const generateGetters = (attributes) => {
        return attributes.map(attr => {
            const capitalizedName = attr.name.charAt(0).toUpperCase() + attr.name.slice(1);
            return `    public ${attr.type} get${capitalizedName}() {
        return this.${attr.name};
    }`;
        }).join('\n\n');
    };

    // Fonction pour générer les setters
    const generateSetters = (attributes) => {
        return attributes.map(attr => {
            const capitalizedName = attr.name.charAt(0).toUpperCase() + attr.name.slice(1);
            return `    public void set${capitalizedName}(${attr.type} ${attr.name}) {
        this.${attr.name} = ${attr.name};
    }`;
        }).join('\n\n');
    };

    // Fonction pour générer les constructeurs
    const generateConstructors = (name, attributes, parentClass) => {
        let constructors = [];

        // Constructeur par défaut
        constructors.push(`    public ${name}() {
            ${parentClass ? 'super();' : '// Constructeur par défaut'}
        }`);

        // Séparer les attributs normaux et les attributs de relation
        const normalAttributes = attributes.filter(attr => !attr.isRelation);
        const relationAttributes = attributes.filter(attr => attr.isRelation);

        // Constructeur avec les attributs normaux
        if (normalAttributes.length > 0) {
            const params = normalAttributes
                .map(attr => `${attr.type} ${attr.name}`)
                .join(', ');
            
            const assignments = normalAttributes
                .map(attr => `        this.${attr.name} = ${attr.name};`)
                .join('\n');

            const constructor = [
                `    public ${name}(${params}) {`,
                parentClass ? '        super();' : '',
                assignments,
                '    }'
            ].filter(line => line).join('\n');

            constructors.push(constructor);
        }

        // Constructeur avec tous les attributs (normaux + relations)
        if (attributes.length > normalAttributes.length) {
            const allParams = attributes
                .map(attr => `${attr.type} ${attr.name}`)
                .join(', ');
            
            const allAssignments = attributes
                .map(attr => `        this.${attr.name} = ${attr.name};`)
                .join('\n');

            const constructor = [
                `    public ${name}(${allParams}) {`,
                parentClass ? '        super();' : '',
                allAssignments,
                '    }'
            ].filter(line => line).join('\n');

            constructors.push(constructor);
        }

        return constructors.join('\n\n');
    };

    // Formatage des données
    const formattedData = {
        projectName: "MyJavaProject",
        package: "com.example",
        classes: nodes.map(node => {
            console.log("Processing node:", node);
            const relationAttributes = [];

            edges.forEach(edge => {
                console.log("Processing edge:", edge);
                if (!edge || !edge.data) {
                    console.log("Edge or edge.data is undefined");
                    return;
                }

                const isSource = edge.source === node.id;
                const isTarget = edge.target === node.id;
                const otherNodeId = isSource ? edge.target : edge.source;
                const otherClassName = classNameMap[otherNodeId];

                console.log("Relation info:", {
                    isSource,
                    isTarget,
                    otherNodeId,
                    otherClassName,
                    relationType: edge.data.relationType
                });

                if (!otherClassName) {
                    console.log("otherClassName is undefined for nodeId:", otherNodeId);
                    return;
                }

                try {
                    // Pour une relation unidirectionnelle
                    if (edge.data.relationType === 'unidirectionnelle' && isSource) {
                        const cardinality = edge.data.targetCardinality;
                        relationAttributes.push({
                            visibility: '-',
                            name: otherClassName.toLowerCase() + (cardinality === '*' ? 'List' : ''),
                            type: cardinality === '*' ? `List<${otherClassName}>` : otherClassName,
                            isRelation: true
                        });
                    }
                    // Pour une relation bidirectionnelle
                    else if (edge.data.relationType === 'bidirectional') {
                        const cardinality = isSource ? edge.data.targetCardinality : edge.data.sourceCardinality;
                        relationAttributes.push({
                            visibility: '-',
                            name: otherClassName.toLowerCase() + (cardinality === '*' ? 'List' : ''),
                            type: cardinality === '*' ? `List<${otherClassName}>` : otherClassName,
                            isRelation: true
                        });
                    }
                } catch (error) {
                    console.error("Error processing relation:", error);
                }
            });

            return {
                type: node.type,
                name: node.data.className,
                attributes: [
                    ...node.data.attributes.map(attr => ({
                        visibility: attr.etat,
                        name: attr.attNom,
                        type: attr.type,
                        isRelation: false
                    })),
                    ...relationAttributes
                ],
                methods: node.data.methods
            };
        })
    };

    // Génération du code Java
    const javaCode = formattedData.classes.map(classData => {
        const { type, name, attributes, methods } = classData;
        
        const classDeclaration = type === 'umlInterface' ? 'public interface' :
                               type === 'umlAbstractClass' ? 'public abstract class' : 
                               'public class';

        const extensions = [];
        const implementations = [];

        const inheritance = extensions.length > 0 ? `extends ${extensions[0]}` : '';
        const implementation = implementations.length > 0 ? `implements ${implementations.join(', ')}` : '';

        // Vérifier si nous avons besoin des imports List/ArrayList
        const needsCollectionImports = attributes.some(attr => attr.type.startsWith('List<'));

        const imports = new Set();
        if (needsCollectionImports) {
            imports.add('import java.util.List;');
            imports.add('import java.util.ArrayList;');
        }

        const attributesCode = attributes.length > 0 
            ? attributes
                .map(attr => {
                    const visibility = attr.visibility === '+' ? 'public' :
                                     attr.visibility === '-' ? 'private' :
                                     attr.visibility === '#' ? 'protected' : 
                                     'private';
                    return `    ${visibility} ${attr.type} ${attr.name};`;
                })
                .join('\n')
            : '';

        const constructorsCode = type !== 'umlInterface' && attributes.length > 0 
            ? generateConstructors(name, attributes, extensions[0])
            : '';
        
        const gettersCode = type !== 'umlInterface' && attributes.length > 0
            ? generateGetters(attributes)
            : '';
        
        const settersCode = type !== 'umlInterface' && attributes.length > 0
            ? generateSetters(attributes)
            : '';

        const methodsCode = methods.length > 0
            ? methods
                .map(method => {
                    const visibility = method.visibility === '+' ? 'public' :
                                     method.visibility === '-' ? 'private' :
                                     method.visibility === '#' ? 'protected' : 
                                     'private';
                    
                    let returnStatement = '';
                    switch(method.returnType.toLowerCase()) {
                        case 'void':
                            returnStatement = '';
                            break;
                        case 'int':
                            returnStatement = '        return 0;';
                            break;
                        case 'double':
                        case 'float':
                            returnStatement = '        return 0.0;';
                            break;
                        case 'boolean':
                            returnStatement = '        return false;';
                            break;
                        case 'string':
                            returnStatement = '        return "";';
                            break;
                        default:
                            returnStatement = '        return null;';
                    }

                    return `    ${visibility} ${method.returnType} ${method.name}() {
        // TODO: Implement method
${returnStatement}
    }`;
                })
                .join('\n\n')
            : '';

        // Assembler les sections non vides
        const sections = [
            `package ${formattedData.package};`,
            '',
            Array.from(imports).join('\n'),
            '',
            `${classDeclaration} ${name} ${inheritance} ${implementation} {`,
            attributesCode,
            constructorsCode,
            gettersCode,
            settersCode,
            methodsCode,
            '}'
        ].filter(section => section !== '' && section !== '\n');

        return sections.join('\n\n');
    }).join('\n\n');

    // Téléchargement du fichier
    const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(javaCode);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'JavaClasses.java');
    linkElement.click();
};