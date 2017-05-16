export default [
    {
        name: 'systemType',
        text: 'Tipo de Sistema',
        type: 'multi',
        options: [
            {
                name: 'gc',
                text: 'Gas Condensado'
            },
            {
                name: 'liq',
                text: 'Líquido'
            }
        ]
    },
    {
        name: 'gasGradient',
        text: 'Gradiente de gas (psi/ft)',
        type: 'numeric',
        show: state => state.answers.system_type === 'gc'
    },
    {
        name: 'hGasket',
        text: 'Altura Empaque (ft)',
        type: 'numeric'
    },
    {
        name: 'hBrine',
        text: 'Altura Salmuera (ft)',
        type: 'numeric'
    },
    {
        name: 'tvd',
        text: 'TVD (ft)',
        type: 'numeric'
    },
    {
        name: 'p',
        text: 'Presión estática (psi)',
        type: 'numeric'
    },
    {
        name: 'rhoBrine',
        text: 'Densidad de la Salmuera (ppg)',
        type: 'numeric'
    },
    {
        name: 'id',
        text: 'ID tubing (in)',
        type: 'numeric',
        precision: 3,
    },
    {
        name: 'od',
        text: 'OD tubing (in)',
        type: 'numeric',
        precision: 3,
    },
    {
        name: 'api',
        text: 'Gravedad API',
        type: 'numeric',
    },
    {
        name: 'waterCut',
        text: 'Corte de Agua',
        type: 'numeric'
    },
    {
        name: 'rhoW',
        text: 'Densidad del Agua (ppg)',
        type: 'numeric'
    },
    {
        name: 'grade',
        text: 'Grado de Tubería',
        type: 'multi',
        options: [
            {name: 'l80', text:'L80'},
            {name: 'l809', text:'L80 9'},
            {name: 'l8013', text:'L80 13'},
            {name: 'cr13', text:'13% Cr'},
            {name: 't95', text:'T95'},
            {name: 'p110', text:'P110'},
            {name: 'sCr13', text:'S 13% Cr'},
            {name: 'cr22', text:'22% Cr'},
            {name: 'cr25', text:'25% Cr'},
            {name: 'cr1', text:'1% Cr'},
            {name: 'cr9', text:'9% Cr'},
            {name: 'cr3', text:'3% Cr'},
            {name: 'cr5', text:'5% Cr'},
            {name: 'j55', text:'J55'},
            {name: 'n80', text:'N80'},
            {name: 'c90', text:'C90'},
            {name: 'c95', text:'C95'},
            {name: 'q125', text:'Q125'},
        ]
    },
]
