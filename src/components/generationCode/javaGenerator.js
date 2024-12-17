export const generateJavaFiles = (nodes, edges) => {
    // Créer un map des IDs vers les noms de classes
    const classNameMap = {};
    nodes.forEach(node => {
        if (node?.data?.className) {
            classNameMap[node.id] = node.data.className;
        }
    });

    // Fonction pour formater le nom de l'attribut
    const formatAttributeName = (className, cardinality) => {
        if (!className) return '';
        const firstChar = className.charAt(0).toLowerCase();
        const rest = className.slice(1);
        return firstChar + rest + (cardinality === '*' ? 'List' : '');
    };

    // Fonction pour générer les getters
    const generateGetters = (attributes) => {
        return attributes
            .filter(attr => attr.visibility === '-' && attr.name && attr.type)
            .map(attr => {
                const capitalizedName = attr.name.charAt(0).toUpperCase() + attr.name.slice(1);
                return `    public ${attr.type} get${capitalizedName}() {
        return this.${attr.name};
    }`;
            })
            .join('\n\n');
    };

    // Fonction pour générer les setters
    const generateSetters = (attributes) => {
        return attributes
            .filter(attr => attr.visibility === '-' && attr.name && attr.type)
            .map(attr => {
                const capitalizedName = attr.name.charAt(0).toUpperCase() + attr.name.slice(1);
                return `    public void set${capitalizedName}(${attr.type} ${attr.name}) {
        this.${attr.name} = ${attr.name};
    }`;
            })
            .join('\n\n');
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

        return constructors.join('\n\n');
    };

    // Formatage des données
    const formattedData = {
        projectName: "MyJavaProject",
        package: "com.example",
        classes: nodes.map(node => {
            if (!node?.data?.className) return null;

            // Trouver les relations d'héritage (source vers target)
            const inheritance = edges.find(edge => 
                edge.source === node.id && 
                edge.data?.relationType === 'inheritance'
            );

            // Trouver les relations d'implémentation (source vers target)
            const implementation = edges.find(edge => 
                edge.source === node.id && 
                edge.data?.relationType === 'implementation'
            );

            // Trouver les relations de navigabilité
            const relationAttributes = [];
            edges.forEach(edge => {
                if (!edge?.data) return;

                const isSource = edge.source === node.id;
                const isTarget = edge.target === node.id;
                const otherNodeId = isSource ? edge.target : edge.source;
                const otherClassName = classNameMap[otherNodeId];

                if (!otherClassName) return;

                // Pour une relation unidirectionnelle
                if (edge.data.relationType === 'unidirectionnelle' && isSource) {
                    // Ajouter l'attribut seulement dans la source
                    const cardinality = edge.data.targetCardinality;
                    relationAttributes.push({
                        visibility: '-',
                        name: formatAttributeName(otherClassName, cardinality),
                        type: cardinality === '*' ? `List<${otherClassName}>` : otherClassName,
                        isRelation: true
                    });
                }
                // Pour une relation bidirectionnelle
                else if (edge.data.relationType === 'bidirectional' && 
                        (edge.source === node.id || edge.target === node.id)) {
                    // Ajouter l'attribut uniquement si cette classe est impliquée dans la relation
                    const cardinality = isSource ? edge.data.targetCardinality : edge.data.sourceCardinality;
                    relationAttributes.push({
                        visibility: '-',
                        name: formatAttributeName(otherClassName, cardinality),
                        type: cardinality === '*' ? `List<${otherClassName}>` : otherClassName,
                        isRelation: true
                    });
                }
            });

            return {
                type: node.type,
                name: node.data.className,
                extends: inheritance ? classNameMap[inheritance.target] : null,
                implements: implementation ? classNameMap[implementation.target] : null,
                attributes: [
                    ...(node.data.attributes || []).map(attr => ({
                        visibility: attr.etat,
                        name: attr.attNom,
                        type: attr.type,
                        isRelation: false
                    })),
                    ...relationAttributes
                ].filter(attr => attr.name && attr.type),
                methods: node.data.methods || []
            };
        }).filter(Boolean)
    };

    // Génération du code Java
    const javaCode = formattedData.classes.map(classData => {
        const { type, name, extends: parentClass, implements: interfaceClass, attributes, methods } = classData;
        
        const classDeclaration = type === 'umlInterface' ? 'public interface' :
                               type === 'umlAbstractClass' ? 'public abstract class' : 
                               'public class';

        const inheritance = parentClass ? ` extends ${parentClass}` : '';
        const implementation = interfaceClass ? ` implements ${interfaceClass}` : '';

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
            ? generateConstructors(name, attributes, parentClass)
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
                                     'public';
                    return `    ${visibility} ${method.returnType} ${method.name}() {
        // TODO: Implement method
        return ${method.returnType === 'void' ? '' : 
                method.returnType === 'int' ? '0' :
                method.returnType === 'double' ? '0.0' :
                method.returnType === 'boolean' ? 'false' :
                method.returnType === 'String' ? '""' : 'null'};
    }`;
                })
                .join('\n\n')
            : '';

        const sections = [
            `package ${formattedData.package};`,
            '',
            Array.from(imports).join('\n'),
            '',
            `${classDeclaration} ${name}${inheritance}${implementation} {`,
            attributesCode,
            '',
            constructorsCode,
            '',
            gettersCode,
            '',
            settersCode,
            '',
            methodsCode,
            '}'
        ].filter(section => section !== null && section !== undefined);

        return sections.join('\n');
    }).join('\n\n');

    // Téléchargement du fichier
    const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(javaCode);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'JavaClasses.java');
    linkElement.click();
};