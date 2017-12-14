import React, { Component } from 'react'
import Recommendations from './Recommendations.jsx'

const questions = {
    'have-phi': {
        title: 'Matriz de Formacion',
        text: '¿Tiene el valor promedio de porosidad de formación?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'phi': {
        text: 'Ingrese la porosidad',
        type: 'numeric',
        default: 15,
        prereq: {
            question: 'have-phi',
            answer: 'yes',
        }
    },
    'ambient': {
        text: '¿En que ambiente operacional se encuentra?',
        type: 'multi',
        options: {
            conventional: 'Convencional',
            unconventional: 'No Convencional',
        },
        default: 'conventional',
        prereq: {
            question: 'have-phi',
            answer: 'no',
        },
    },
    'reservoir': {
        text: 'Tipo de reservorio convencional',
        type: 'multi',
        options: {
            conventional: 'Completamiento convencional',
            'no-consolidated': 'Reservorios no consolidados',
            carbonate: 'Reservorios de carbonatos',
        },
        default: 'conventional',
        prereq: {
            question: 'ambient',
            answer: 'conventional',
        },
    },
    'fraq': {
        text: '¿Reservorios a fracturamiento hidráulico?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
        prereq: {
            question: 'reservoir',
            answer: 'carbonate',
        },
    },
    'multi-fraq': {
        text: '¿Reservorio a fracturamiento hidráulico multi-etapa en pozos horizontales?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
        prereq: {
            question: 'ambient',
            answer: 'unconventional',
        },
    },
    'have-ucs': {
        text: '¿Tiene el valor de UCS (Resistencia a la formación no confinada) en Psi?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'ucs': {
        text: 'Ingrese el valor de UCS en Psi',
        type: 'numeric',
        default: 3000,
        prereq: {
            question: 'have-ucs',
            answer: 'yes',
        }
    },
    'ucs-range': {
        text: '¿En que rango estimado según PVT se encuentra?',
        type: 'multi',
        options: {
            lt2200: '<2200 Psi',
            lt4900: '2200 a 4900 Psi',
            lt6500: '4900 a 6500 Psi',
            lt13000: '6500 a 13000 Psi',
            gt13000: '>13000 Psi',
        },
        default: 'lt4900',
        prereq: {
            question: 'have-ucs',
            answer: 'no',
        },
    },
    'py': {
        text: '¿Cuál es la presión promedio del yacimiento?',
        type: 'numeric',
        default: 3000,
    },
    'pc': {
        text: '¿Cuál es la presión en cabezal?',
        type: 'numeric',
        default: 200,
    },
    'type-s': {
        text: '¿Cuál es el factor de daño según el estado del pozo?',
        type: 'multi',
        options: {
            damaged: 'Pozo dañado',
            estimulated: 'Pozo estimulado',
        },
        default: 'damaged',
    },
    'damage': {
        text: '¿Altamente dañado?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
        prereq: {
            question: 'type-s',
            answer: 'damaged',
        },
    },
    'estimulation': {
        text: 'Tipo de estimulación',
        type: 'multi',
        options: {
            acid: 'Acidificación',
            hydraulic: 'F. Hidráulico',
            'massive-hidraulic': 'F. Hidráulico masivo',
        },
        default: 'acid',
        prereq: {
            question: 'type-s',
            answer: 'estimulated',
        },
    },
    'have-k': {
        text: '¿Tiene la permeabilidad promedio de la formación en miliDarcies?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'k': {
        text: 'Ingrese la permeabilidad',
        type: 'numeric',
        default: 100,
        prereq: {
            question: 'have-k',
            answer: 'yes',
        },
    },
    'formation-type': {
        text: '¿En qué tipo de formación se encuentra?',
        type: 'multi',
        options: {
            sand: 'Arena Consolidada',
            carbonate: 'Carbonato',
        },
        default: 'sand',
        prereq: {
            question: 'have-k',
            answer: 'no',
        },
    },
    'k-range-1': {
        text: '¿En que rango de permeabilidad se encuentra?',
        type: 'multi',
        options: {
            lt10: '< 10 mD',
            lt100: '10 mD a 100 mD',
            gt100: '> 100 mD',
        },
        default: 'lt100',
        prereq: {
            question: 'formation-type',
            answer: 'sand',
        },
    },
    'k-range-2': {
        text: '¿En que rango de permeabilidad se encuentra?',
        type: 'multi',
        options: {
            lt10: '< 10 mD',
            lt100: '10 mD a 100 mD',
            lt250: '100 mD a 250 mD',
            gt250: '> 250 mD',
        },
        default: 'lt100',
        prereq: {
            question: 'formation-type',
            answer: 'carbonate',
        },
    },
    'have-angle': {
        text: '¿Conoce el ángulo formado respecto a la vertical de formación?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'angle': {
        text: 'Ingrese el ángulo',
        type: 'numeric',
        default: 0,
        prereq: {
            question: 'have-angle',
            answer: 'yes',
        },
    },
    'angle-range': {
        text: '¿En que rango se encuentra según perforación?',
        type: 'multi',
        options: {
            low: 'Bajo (∢0 a 5)',
            medium: 'Medio (∢5 a 20)',
            high: 'Alto (∢20 a 40)',
        },
        default: 'low',
        prereq: {
            question: 'have-angle',
            answer: 'no',
        },
    },
    'time': {
        title: 'Matriz de tipo de fluido',
        text: '¿Qué rango de tiempo en horas dispone?',
        type: 'multi',
        options: {
            lt100: '1 a 100',
            lt200: '100 a 200',
            lt300: '200 a 300',
        },
        default: 'lt200',
    },
    'have-pressure': {
        text: '¿Conoce la presión promedio en fondo de pozo (Psi)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'pressure': {
        text: 'Ingrese la presión promedio en fondo de pozo',
        type: 'numeric',
        default: 3000,
        prereq: {
            question: 'have-pressure',
            answer: 'yes',
        },
    },
    'depth-1': {
        text: 'Indicar la profundidad en pies del primer intervalo a cañonear',
        type: 'numeric',
        default: 6000,
        prereq: {
            question: 'have-pressure',
            answer: 'no',
        },
    },
    'have-temperature': {
        text: '¿Conoce la temperatura en (ºF)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'temperature': {
        text: 'Ingrese la temperatura en (ºF)',
        type: 'numeric',
        default: 200,
        prereq: {
            question: 'have-temperature',
            answer: 'yes',
        },
    },
    'depth-2': {
        text: 'Indicar la profundidad en pies del primer intervalo a cañonear',
        type: 'numeric',
        default: 6000,
        prereq: {
            question: 'have-temperature',
            answer: 'no',
        },
    },
    'fluid': {
        text: '¿Qué tipo de fluido tiene en yacimiento?',
        type: 'multi',
        options: {
            bifasic: 'Bifásico',
            trifasic: 'Trifásico',
        },
        default: 'bifasic',
    },
    'have-api': {
        text: '¿Conoce la gravedad API del crudo?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'api': {
        text: 'Ingrese la gravedad API del crudo',
        type: 'numeric',
        default: 20,
        prereq: {
            question: 'have-api',
            answer: 'yes',
        },
    },
    'oil-type': {
        text: '¿Qué tipo de crudo espera en superficie?',
        type: 'multi',
        options: {
            'e-heavy': 'Extrapesado (<9.9)',
            'heavy': 'Pesado (10 a 15)',
            'medium': 'Mediano (15 a 29.9)',
            'light': 'Liviano (30 a 39.9)',
            'condensed': 'Condensado (>40)',
        },
        default: 'medium',
        prereq: {
            question: 'have-api',
            answer: 'no',
        },
    },
    'have-visc-oil': {
        text: '¿Conoce la viscosidad del crudo en cP?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'visc-oil': {
        text: 'Ingrese la viscosidad del crudo en cP',
        type: 'numeric',
        default: 100,
        prereq: {
            question: 'have-visc-oil',
            answer: 'yes',
        },
    },
    'have-salt-water': {
        text: '¿Conoce la salinidad del agua de formación (%)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'salt-water': {
        text: 'Ingrese la salinidad del agua de formación (%)',
        type: 'numeric',
        default: 15,
        prereq: {
            question: 'have-salt-water',
            answer: 'yes',
        },
    },
    'salt-water-range': {
        text: '¿Qué tipo de agua de formación según registros eléctricos tiene?',
        type: 'multi',
        options: {
            high: 'Alta resistividad (1-10%)',
            medium: 'Resistividad media (10-20%)',
            low: 'Baja resistividad (20 a 26%)',
        },
        default: 'medium',
        prereq: {
            question: 'have-salt-water',
            answer: 'no',
        },
    },
    'have-visc-water': {
        text: '¿Conoce la viscosidad del agua de formación en cP?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'visc-water': {
        text: 'Ingrese la viscosidad del agua de formación en cP',
        type: 'numeric',
        default: 50,
        prereq: {
            question: 'have-visc-water',
            answer: 'yes',
        },
    },
    'saturation-gas': {
        text: 'Indique la saturación inicial de gas en el yacimiento',
        type: 'numeric',
        default: 20,
        prereq: {
            question: 'fluid',
            answer: 'trifasic',
        },
    },
    'multiple-intervals': {
        title: 'Matriz de sistema de conectividad',
        text: '¿Se pretende cañonear múltiples intervalos?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    'speed': {
        text: '¿Es Obligatorio obtener una velocidad avanzada de operación (T<12 Horas) (Multizonal)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
        prereq: {
            question: 'multiple-intervals',
            answer: 'yes',
        },
    },
    'have-interval': {
        text: '¿Conoce cual es la longitud del intervalo a cañonear?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
        prereq: {
            question: 'multiple-intervals',
            answer: 'no',
        },
    },
    'interval': {
        text: 'Indicar la longitud del intervalo a cañonear',
        type: 'numeric',
        default: 45,
        prereq: {
            question: 'have-interval',
            answer: 'yes',
        },
    },
    'interval-range': {
        text: '¿Cual es el rango aproximado en pies?',
        type: 'multi',
        options: {
            lt30: '<30',
            lt60: '30 a 60',
            gt60: '>60',
        },
        default: 'lt60',
        prereq: {
            question: 'have-interval',
            answer: 'no',
        },
    },
    'have-diameter': {
        text: '¿Conoce el diámetro de perforado según la dureza de tubería?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'diameter': {
        text: 'Indicar el diámetro de perforado',
        type: 'numeric',
        default: 10,
        prereq: {
            question: 'have-diameter',
            answer: 'yes',
        },
    },
    'ideal-diameter': {
        text: 'Indicar diametro ideal de perforado',
        type: 'numeric',
        default: 10,
        prereq: {
            question: 'have-diameter',
            answer: 'no',
        },
    },
    'casing-grade-0': {
        text: 'Indicar grado de tubería de revestimiento',
        type: 'multi',
        options: {
            j55: 'J-55',
            k55: 'K-55',
            c55: 'C-55',
            l80: 'L-80',
            n80: 'N-80',
            c95: 'C-95',
            s95: 'S-95',
            p105: 'P-105',
            p110: 'P-110',
        },
        default: 'k55',
        prereq: {
            question: 'have-diameter',
            answer: 'no',
        },
    },
    'have-casing-id': {
        text: '¿Conoce el diámetro interno de la tubería de revestimiento?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'casing-id': {
        text: 'Indicar el diámetro interno de la tubería de revestimiento',
        type: 'numeric',
        default: 7,
        prereq: {
            question: 'have-casing-id',
            answer: 'yes',
        },
    },
    'casing-grade': {
        text: 'Indicar grado de la tubería de revestimiento',
        type: 'multi',
        options: {
            k55: 'K-55',
            l80: 'L-80',
            p110: 'P-110',
            v150: 'V-150',
            mw155: 'MW-155',
            soo140: 'SOO-140',
            soo155: 'SOO-155',
        },
        default: 'k55',
        prereq: {
            question: 'have-casing-id',
            answer: 'no',
        },
    },
    'casing-weight-k55': {
        text: 'Indicar peso nominal de la tubería de revestimiento',
        type: 'multi',
        options: {
            '94': '94',
            '133': '133',
            '65': '65',
            '75': '75',
            '109': '109',
        },
        default: '94',
        prereq: {
            question: 'casing-grade',
            answer: 'k55',
        },
    },
    'casing-weight-l80': {
        text: 'Indicar peso nominal de la tubería de revestimiento',
        type: 'multi',
        options: {
            '81': '81',
            '98': '98',
            '58.4': '58.4',
        },
        default: '81',
        prereq: {
            question: 'casing-grade',
            answer: 'l80',
        },
    },
    'casing-weight-p110': {
        text: 'Indicar peso nominal de la tubería de revestimiento',
        type: 'multi',
        options: {
            '85': '85',
            '98': '98',
            '47': '47',
        },
        default: '85',
        prereq: {
            question: 'casing-grade',
            answer: 'p110',
        },
    },
    'casing-weight-v150': {
        text: 'Indicar peso nominal de la tubería de revestimiento',
        type: 'multi',
        options: {
            '38': '38',
            '41': '41',
            '46': '46',
        },
        default: '38',
        prereq: {
            question: 'casing-grade',
            answer: 'v150',
        },
    },
    'pressure-condition': {
        text: '¿Con base al valor de presión promedio de formación, en que condición se pretende realizar la operación?',
        type: 'multi',
        options: {
            underbalance: 'Bajo-balance',
            overbalance: 'Sobre-balance',
        },
        default: 'overbalance',
    },
    'have-underbalance-pressure': {
        text: '¿Conoce el valor de bajo-balance dinámico en Psi?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
        prereq: {
            question: 'pressure-condition',
            answer: 'underbalance',
        },
    },
    'underbalance-pressure': {
        text: 'Indicar el valor de bajo-balance dinámico en Psi',
        type: 'numeric',
        default: 100,
        prereq: {
            question: 'have-underbalance-pressure',
            answer: 'yes',
        },
    },
    'gas-oil': {
        text: '¿Yacimiento de gas o de petróleo?',
        type: 'multi',
        options: {
            gas: 'Gas',
            oil: 'Petróleo',
        },
        default: 'oil',
        prereq: {
            question: 'have-underbalance-pressure',
            answer: 'no',
        },
    },
    'k-gas-oil': {
        text: 'Insertar valor de permeabilidad',
        type: 'numeric',
        default: 100,
        prereq: {
            question: 'have-underbalance-pressure',
            answer: 'no',
        },
    },
    'eob': {
        text: '¿Se pretende desarrollar EOB (Sobre-balance extremo)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
        prereq: {
            question: 'pressure-condition',
            answer: 'overbalance',
        },
    },
    'have-pr': {
        text: '¿Conoce cual es la relación de productividad esperada por el pozo?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'pr': {
        text: 'Insertar relación de productividad esperada por el pozo',
        type: 'numeric',
        default: 1,
        prereq: {
            question: 'have-pr',
            answer: 'yes',
        },
    },
    'pr-range': {
        text: '¿En que rango se encuentra?',
        type: 'multi',
        options: {
            lt08: '0.5 a 0.8',
            lt12: '0.8 a 1.2',
            lt15: '1.2 a 1.5',
        },
        default: 'lt12',
        prereq: {
            question: 'have-pr',
            answer: 'no',
        },
    },
    'conditions': {
        text: (
            <p>
                ¿Operativamente, se tiene alguna de estas condiciones?
                <ul>
                    <li>El ensamblaje con Wireline supera el limite tensional o axial máximo</li>
                    <li>Producción H2S y/o Co2</li>
                    <li>Alta presión en cabeza</li>
                </ul>
            </p>
        ),
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    }
}

const recommendations = {
    '1g': {
        name: 'lpsd',
        text: 'Tecnología LPSD(Low debris and Shock)',
    },
    '2g': {
        name: 'tcp-propelente',
        text: 'Tecnología TCP Propelente-Sobrebalance',
    },
    '3g': {
        name: 'stimtube',
        text: 'Tecnología Stimtube',
    },
    '4g': {
        name: 'powr-perf',
        text: 'Tecnología POWR/PERF',
    },
    '5g': {
        name: 'perfstim',
        text: 'Tecnología PerfStim',
    },
    '6g': {
        name: 'plug-perf',
        text: 'Tecnología de completamiento de cañón insertable (Plug and Perf)',
    },
    '7g': {
        name: 'connex',
        text: 'Tecnología de cargas CONNEX',
    },
    '8g': {
        name: 'diametro-definido',
        text: 'Tecnología de Carga de diámetro de perforado definido',
    },
    '9g': {
        name: 'fragmenting-gun',
        text: 'Tecnología Fragmenting Gun',
    },
    '10g': {
        name: 'actf',
        text: 'Tecnología ACTF (Annular Coiled Tubing Fracturing)',
    },
    '11g': {
        name: 'jitp',
        text: 'Tecnología JITP (Just in Time Perforating)',
    },
    '12g': {
        name: 'reactive',
        text: 'Tecnología Reactive Liner Shaped Charges',
    },
    '13g': {
        name: 'triple-jet',
        text: 'Tecnología Triple Jet Perforating',
    },
    '14g': {
        name: 'converging',
        text: 'Tecnología Converging Focused Perforating',
    },
    '15g': {
        name: 'electrical-bar',
        text: 'Tecnología Dropping Electrical Bar Perforating',
    },
    '16g': {
        name: 'side-mounted',
        text: 'Tecnología Side Mounted Gun Perforating',
    },
    '17g': {
        name: 'hops',
        text: 'Tecnología HOPS (Horizontal Oriented Perforating Sistems)',
    },
    '1r': {
        name: 'cross-jet',
        text: 'Cross-Linked Jet fluids',
    },
    '2r': {
        name: 'ct-fracturing',
        text: 'CT Pin-Point SandJet Annular Fracturing Technique',
    },
    '3r': {
        name: 'hydro-jet',
        text: 'Hydro-Jet',
    },
    '4r': {
        name: 'radial-jet',
        text: 'Radial Jet Drilling',
    },
    '5r': {
        name: 'channel-stimulation',
        text: 'Channel Stimulation technology',
    },
    '6r': {
        name: 'slickwater',
        text: 'Slickwater Hydraulic System',
    },
    '7r': {
        name: 'cemented-plug-perf',
        text: 'Cemented Liner Plug and Perf Completion',
    },
    '8r': {
        name: 'fishbone',
        text: 'Multilateral Technology for Stimulation (Fishbone)',
    },
    '9r': {
        name: 'oh-multistage',
        text: 'Open Hole Multistage Sistem',
    },
    '10r': {
        name: 'hegf',
        text: 'Tecnología HEGF',
    },
}

/* eslint-disable curly */
function getValues(state) {
    let phi = null
    if (state['have-phi'] === 'yes') {
        phi = state['phi']
    } else {
        if (state['ambient'] === 'conventional') {
            if (state['reservoir'] === 'conventional') {
                phi = 17.5
            } else if (state['reservoir'] === 'no-consolidated') {
                phi = 25
            } else {
                if (state['fraq'] === 'yes') {
                    phi = 2.5
                } else {
                    phi = 7.5
                }
            }
        } else {
            if (state['multi-fraq'] === 'yes') {
                phi = 2.5
            } else {
                phi = 12.5
            }
        }
    }

    let ucs = null
    if (state['have-ucs'] === 'yes') {
        ucs = state['ucs']
    } else {
        switch (state['ucs-range']) {
        case 'lt2200':
            ucs = 2200; break
        case 'lt4900':
            ucs = 3550; break
        case 'lt6500':
            ucs = 5700; break
        case 'lt13000':
            ucs = 9750; break
        default:
            ucs = 13000
        }
    }

    const py = state['py']
    const pc = state['pc']

    const a = 0.0967 * Math.pow(phi/100, 0.428)
    const b = ucs < 30000
        ? 0.7336 - 1.813e-5 * ucs
        : 3.33 * Math.exp(-9.55e-5 * ucs)
    const Peff = pc - a * py
    const Fbi = ucs + b * Peff

    let skin = null
    if (state['type-s'] === 'damaged') {
        if (state['damage'] === 'yes') {
            skin = 10
        } else {
            skin = 2
        }
    } else {
        switch (state['estimulation']) {
        case 'acid':
            skin = -1; break
        case 'hydraulic':
            skin = -3; break
        default:
            skin = -5
        }
    }

    let k = null
    if (state['have-k'] === 'yes') {
        k = state['k']
    } else {
        if (state['formation-type'] === 'sand') {
            switch (state['k-range-1']) {
            case 'lt10':
                k = 10; break
            case 'lt100':
                k = 55; break
            default:
                k = 100
            }
        } else {
            switch (state['k-range-2']) {
            case 'lt10':
                k = 10; break
            case 'lt100':
                k = 55; break
            case 'lt250':
                k = 225; break
            default:
                k = 250
            }
        }
    }

    let angle = null
    if (state['have-angle'] === 'yes') {
        angle = state['angle']
    } else {
        switch (state['angle-range']) {
        case 'low':
            angle = 5; break
        case 'medium':
            angle = 18; break
        default:
            angle = 30
        }
    }

    const gasLayer = state['fluid'] === 'trifasic'

    let temperature = null
    if (state['have-temperature']) {
        temperature = state['temperature']
    } else {
        const depth = state['depth-2']
        temperature = 2 * depth / 100
    }

    let api = null
    if (state['have-api'] === 'yes') {
        api = state['api']
    } else {
        switch (state['oil-type']) {
        case 'e-heavy':
            api = 5; break
        case 'heavy':
            api = 12; break
        case 'medium':
            api = 24; break
        case 'light':
            api = 35; break
        default:
            api = 45
        }
    }

    let viscOil = null
    if (state['have-visc-oil'] === 'yes') {
        viscOil = state['visc-oil']
    } else {
        const T = temperature
        // Glaso
        viscOil = 3.141e10 * Math.pow(T, -3.444) * Math.pow(Math.log10(api), 10.313 * Math.log10(T) - 36.4)
    }

    let saltWater = null
    if (state['have-salt-water'] === 'yes') {
        saltWater = state['salt-water']
    } else {
        switch (state['salt-water-range']) {
        case 'high':
            saltWater = 5; break
        case 'medium':
            saltWater = 15; break
        default:
            saltWater = 23
        }
    }

    let viscWater = null
    if (state['have-visc-water'] === 'yes') {
        viscWater = state['visc-water']
    } else {
        // McCain, W.D., Jr.
        const S = saltWater
        const T = temperature
        const A = 109.574 - 8.40564 * S + 0.313314 * Math.pow(S, 2) + 8.72213e-3 * Math.pow(S, 3)
        const B = -1.12166 + 2.63951e-2 * S - 6.79461e-4 * Math.pow(S, 2) - 5.47119e-5 * Math.pow(S, 3) + 1.55586e-6 * Math.pow(S, 4)
        viscWater = A * Math.pow(T, B)
    }

    let deltaH = null
    if (state['have-interval'] === 'yes') {
        deltaH = state['interval']
    } else {
        switch (state['interval-range']) {
        case 'lt30':
            deltaH = 30; break
        case 'lt60':
            deltaH = 45; break
        default:
            deltaH = 60
        }
    }

    let dp = null
    const dpLookup = {
        j55: {
            xr: 152,
            x: 209,
        },
        k55: {
            xr: 203,
            x: 256,
        },
        c55: {
            xr: 203,
            x: 261,
        },
        l80: {
            xr: 203,
            x: 243,
        },
        n80: {
            xr: 209,
            x: 254,
        },
        c95: {
            xr: 219,
            x: 254,
        },
        s95: {
            xr: 238,
            x: 294,
        },
        p105: {
            xr: 254,
            x: 303,
        },
        p110: {
            xr: 265,
            x: 327,
        },
    }
    if (state['have-diameter'] === 'yes') {
        dp = state['diameter']
    } else {
        const dr = state['ideal-diameter']
        const grade = state['casing-grade-0']
        const { xr, x } = dpLookup[grade]
        dp = Math.sqrt((2250 + 4.2 * xr) / (2250 + 4.2 * x)) * dr
    }

    let di = null
    const diLookup = {
        k55: {
            '94': 19.124,
            '133': 18.730,
            '65': 15.250,
            '75': 15.124,
            '109': 14.688,
        },
        l80: {
            '81': 15.010,
            '98': 11.937,
            '58.4': 8.435,
        },
        p110: {
            '85': 12.159,
            '98': 11.937,
            '47': 8.681,
        },
        v150: {
            '38': 5.920,
            '41': 5.820,
            '46': 5.660,
        },

    }
    if (state['have-casing-id']) {
        di = state['casing-id']
    } else {
        let weight = null
        switch (state['casing-grade']) {
        case 'k55':
            weight = Number(state['casing-weight-k55'])
            di = diLookup['k55'][weight]
            break
        case 'l80':
            weight = Number(state['casing-weight-l80'])
            di = diLookup['l80'][weight]
            break
        case 'p110':
            weight = Number(state['casing-weight-p110'])
            di = diLookup['p110'][weight]
            break
        case 'v150':
            weight = Number(state['casing-weight-v150'])
            di = diLookup['v150'][weight]
            break
        case 'mw155':
            di = 5.920; break
        case 'soo140':
            di = 5.660; break
        default:
            di = 5.660
        }
    }

    let deltaP = null
    if (state['pressure-condition'] === 'underbalance') {
        if (state['have-underbalance-pressure'] === 'yes') {
            deltaP = state['underbalance-pressure']
        } else {
            if (state['gas-oil'] === 'gas') {
                deltaP = 3100 / Math.pow(k, 0.37)
            } else {
                deltaP = 3000 / Math.pow(k, 0.4)
            }
        }
    } else {
        // keep as null
    }

    let pr = null
    if (state['have-pr'] === 'yes') {
        pr = state['pr']
    } else {
        switch (state['pr-range']) {
        case 'lt08':
            pr = 0.65; break
        case 'lt12':
            pr = 1; break
        default:
            pr = 1.35
        }
    }

    return {
        phi,
        ucs,
        py,
        Fbi,
        skin,
        k,
        angle,

        gasLayer,
        viscOil,
        viscWater,

        deltaH,
        dp,
        di,
        deltaP,
        pr,
    }
}
/* eslint-enable curly */

function getRecommended(state) {
    const data = getValues(state)
    // console.log(data)
    const {
        phi,
        ucs,
        py,
        Fbi,
        skin,
        k,
        angle,

        gasLayer,
        viscOil,
        viscWater,

        deltaH,
        dp,
        di,
        deltaP,
        pr,
    } = data

    const constraints = [
        {
            cond: phi < 5 && 2200 < ucs && py < 2000 && Fbi < 0 && (1 < skin && skin < 5) && k < 10 && angle < 5,
            add: ['2g', '5g', '2r'],
        },
        {
            cond: phi < 10 && (2200 < ucs && ucs < 4900) && (2000 < py && py < 4000) && Fbi < 0 && (1 < skin && skin < 5) && (10 < k && k < 100) && angle < 5,
            add: ['10g', '3g'],
        },
        {
            cond: phi < 15 && (4900 < ucs && ucs < 6500) && (4000 < py && py < 6000) && Fbi < 0 && (1 < skin && skin < 5) && (100 < k && k < 250) && angle < 5,
            add: ['11g'],
        },
        {
            cond: phi < 20 && (6500 < ucs && ucs < 13000) && (6000 < py && py < 8000) && Fbi < 0 && (1 < skin && skin < 5) && k > 250 && angle < 5,
            add: ['1g'],
        },
        {
            cond: phi < 25 && ucs > 13000 && (8000 < py && py < 10000) && Fbi < 0 && (1 < skin && skin < 5) && k > 250 && angle < 5,
            add: ['1g'],
        },
        {
            cond: phi < 5 && ucs < 2200 && 2000 < py && Fbi < 0 && 5 < skin && (10 < k && k < 100) && angle < 5,
            add: ['3g', '10r', '2r'],
        },
        {
            cond: (5 < phi && phi < 20) && (2200 < ucs && ucs < 6500) && (2000 < py && py < 4000) && Fbi < 0 && 5 < skin && (10 < k && k < 100) && angle < 5,
            add: ['2g', '12g'],
        },
        {
            cond: 20 < phi && (6500 < ucs && ucs < 13000) && (4000 < py && py < 6000) && Fbi < 0 && 5 < skin && 250 < k && angle < 5,
            add: ['4g'],
        },
        {
            cond: 20 < phi && 13000 < ucs && (6000 < py && py < 8000) && Fbi < 0 && 5 < skin && 250 < k && angle < 5,
            add: ['17g', '1r'],
        },
        {
            cond: phi < 5 && ucs < 2200 && 4000 < py && Fbi < 0 && 5 < skin && (10 < k && k < 100) && (5 < angle && angle < 20),
            add: ['3g', '10r', '3r'],
        },
        {
            cond: (5 < phi && phi < 20) && (2200 < ucs && ucs < 13000) && (4000 < py && py < 8000) && Fbi < 0 && 5 < skin && (100 < k && k < 250) && (5 < angle && angle < 20),
            add: ['5g'],
        },
        {
            cond: 20 < phi && 13000 < ucs && 8000 < py && Fbi < 0 && 5 < skin && 250 < k && (5 < angle && angle < 20),
            add: ['1g', '1r'],
        },
        {
            cond: phi < 5 && ucs < 2200 && 4000 < py && Fbi < 0 && 5 < skin && (10 < k && k < 100) && 25 < angle,
            add: ['2g', '9g', '3r'],
        },
        {
            cond: (5 < phi && phi < 20) && (2200 < ucs && ucs < 13000) && (4000 < py && py < 8000) && Fbi < 0 && 5 < skin && (100 < k && k < 250) && 25 < angle,
            add: ['10g'],
        },
        {
            cond: 20 < phi && 13000 < ucs && 8000 < py && Fbi < 0 && 5 < skin && 250 < k && 25 < angle,
            add: ['4g'],
        },
        {
            cond: phi < 5 && ucs < 2200 && 4000 < py && Fbi > 0 && -3 < skin < -0.1 && (10 < k && k < 100) && 20 < angle,
            add: ['5g', '16g', '5r'],
        },
        {
            cond: (5 < phi && phi < 20) && (2200 < ucs && ucs < 13000) && (4000 < py && py < 8000) && Fbi > 0 && -3 < skin < -0.1 && (100 < k && k < 250) && 20 < angle,
            add: ['12g', '14g'],
        },
        {
            cond: 20 < phi && 13000 < ucs && 8000 < py && Fbi > 0 && -3 < skin < -0.1 && 250 < k && 20 < angle,
            add: ['17g'],
        },
        {
            cond: phi < 5 && ucs < 2200 && 4000 < py && Fbi > 0 && skin < -3 && (10 < k && k < 100) && 20 < angle,
            add: ['16g', '14g', '5r'],
        },
        {
            cond: (5 < phi && phi < 20) && (2200 < ucs && ucs < 13000) && (4000 < py && py < 8000) && Fbi && skin < -3 && (100 < k && k < 250) && 20 < angle,
            add: ['7g', '8g'],
        },
        {
            cond: 20 < phi && 13000 < ucs && 8000 < py && Fbi > 0 && skin < -3 && 250 < k && 20 < angle,
            add: ['17g'],
        },
        {
            cond: phi < 5 && ucs < 2200 && 4000 < py && Fbi > 0 && skin < -3 && (10 < k && k < 100) && 20 > angle,
            add: ['7g', '8g', '4r'],
        },
        {
            cond: (5 < phi && phi < 20) && (2200 < ucs && ucs < 13000) && (4000 < py && py < 8000) && Fbi > 0 && skin < -3 && (100 < k && k < 250) && 20 > angle,
            add: ['1g'],
        },
        {
            cond: 20 < phi && 13000 < ucs && 8000 < py && Fbi > 0 && skin < -3 && 250 < k && 20 > angle,
            add: ['16g', '6g'],
        },
        {
            cond: phi < 5 && ucs < 2200 && 4000 < py && Fbi > 0 && -3 < skin < -0.1 && (10 < k && k < 100) && 20 > angle,
            add: ['7g', '8g', '4r'],
        },
        {
            cond: (5 < phi && phi < 20) && (2200 < ucs && ucs < 13000) && (4000 < py && py < 8000) && Fbi > 0 && -3 < skin < -0.1 && (100 < k && k < 250) && 20 > angle,
            add: ['1g'],
        },
        {
            cond: 20 < phi && 13000 < ucs && 8000 < py && Fbi > 0 && -3 < skin < -0.1 && 250 < k && 20 > angle,
            add: ['6g', '15g'],
        },
        {
            cond: !gasLayer && viscOil > viscWater,
            add: ['3g', '4g', '6r'],
        },
        {
            cond: gasLayer && viscOil > viscWater,
            add: ['12g', '17g', '8r'],
        },
        {
            cond: !gasLayer && viscOil < viscWater,
            add: ['17g', '9g', '2r'],
        },
        {
            cond: gasLayer && viscOil < viscWater,
            add: ['14g', '17g', '1r'],
        },
        {
            cond: deltaH < 30 && (5/16) > dp && di < (3+1/8) && (!deltaP || deltaP < 250) && 0.65 < pr && pr < 1,
            add: ['14g', '17g', '8r'],
        },
        {
            cond: 30 < deltaH && deltaH < 60 && (5/16) > dp && di < (3+1/8) && (!deltaP || deltaP < 250) && 0.65 < pr && pr < 1,
            add: ['11g'],
        },
        {
            cond: 60 < deltaH && (5/16) > dp && di < (3+1/8) && (!deltaP || deltaP < 250) && 0.65 < pr && pr < 1,
            add: ['9g', '16g', '7r'],
        },
        {
            cond: 30 < deltaH && deltaH < 60 && (5/16) > dp && di < (3+1/8) && (!deltaP || 250 < deltaP) && (!deltaP || deltaP < 750) && 0.65 < pr && pr < 1,
            add: ['6g', '17g', '8r'],
        },
        {
            cond: 60 < deltaH && (5/16) > dp && di < (3+1/8) && (!deltaP || 750 < deltaP) && 0.65 < pr && pr < 1,
            add: ['16g', '11g', '7r'],
        },
        {
            cond: deltaH < 30 && (5/16) > dp && di < (3+1/8) && (!deltaP || deltaP < 250) && 1 < pr && pr < 1.35,
            add: ['14g', '5r'],
        },
        {
            cond: 30 < deltaH && deltaH < 60 && (5/16) > dp && di < (3+1/8) && (!deltaP || 250 < deltaP) && (!deltaP || deltaP < 750) && 1 < pr && pr < 1.35,
            add: ['15g'],
        },
        {
            cond: 60 < deltaH && (5/16) > dp && di < (3+1/8) && (!deltaP || 750 < deltaP) && 1 < pr && pr < 1.35,
            add: ['13g', '9r'],
        },
        {
            cond: 30 < deltaH && (5/16) < dp && dp < 7/32 && (3+1/8) < di && di < 4 && (!deltaP || 250 < deltaP) && (!deltaP || deltaP < 500) && 1.35 < pr,
            add: ['15g'],
        },
        {
            cond: 30 < deltaH && deltaH < 60 && 7/32 < dp && 4 < di && di < 5 && (!deltaP || 500 < deltaP) && (!deltaP || deltaP < 1000) && 1.35 < pr,
            add: ['11g', '4r'],
        },
        {
            cond: 60 < deltaH && 7/32 < dp && 5 < di && (!deltaP || deltaP > 1000) && 1.35 < pr,
            add: ['4g', '10g', '6r'],
        },
    ]

    const res = new Set()

    for (const constraint of constraints)
        if (constraint.cond)
            constraint.add.forEach(r => res.add(r))

    return [...res]
}

class NumericInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showText: String(props.value)
        }
    }
    render() {
        const isNumeric = n => !isNaN(Number(n))
        // Handle automatic reuse of components
        const showText = Number(this.state.showText) === this.props.value
            ? this.state.showText
            : String(this.props.value)
        return (
            <input
                type='text'
                value={showText}
                onChange={e => {
                    let val = e.target.value
                    val = val.replace(/,/g, '.')
                    if(isNumeric(val)) {
                        this.setState({showText: val})
                        return this.props.onChange(Number(val))
                    }
                }}
            />
        )
    }
}

function makeLink(name, text) {
    return <a href={'matriz-explicaciones#' + name}>{text}</a>
}

export default class NTPerforateMatrix extends Component {
    constructor() {
        super()
        const questionValues = {}
        for (const [name, question] of Object.entries(questions))
            questionValues[name] = question.default

        this.state = {
            questionValues
        }

        this.renderQuestion = this.renderQuestion.bind(this)
        this.renderMultiQuestion = this.renderMultiQuestion.bind(this)
        this.renderNumericQuestion = this.renderNumericQuestion.bind(this)
        this.change = this.change.bind(this)
    }

    change(value, name) {
        const { state } = this
        state.questionValues[name] = value
        this.setState(state)
    }

    renderMultiQuestion(question, name, answer) {
        return (
            <select value={answer} onChange={e => this.change(e.target.value, name)}>
                {Object.entries(question.options).map(([opName, text]) =>
                    <option value={opName}>{text}</option>
                )}
            </select>
        )
    }

    renderNumericQuestion(question, name, answer) {
        return (
            <NumericInput
                value={answer}
                onChange={val => this.change(val, name)}
            />
        )
    }

    makePretty(input, question, name) {
        return (
            <div key={name}>
                {question.title &&
                    <h2>{question.title}</h2>
                }
                <label htmlFor={question.name}>{question.text}</label>
                <span>{input}</span>
            </div>
        )
    }

    renderQuestion([name, question]) {
        const { state } = this
        const answer = state.questionValues[name]
        let input = null
        switch (question.type) {
        case 'multi':
            input = this.renderMultiQuestion(question, name, answer)
            break
        case 'numeric':
            input = this.renderNumericQuestion(question, name, answer)
            break
        default:
            throw Error('Unkown type of question: ' + question.type)
        }
        return this.makePretty(input, question)
    }

    renderRecommendation({name, text}) {
        return makeLink(name, text)
    }

    render() {
        const { state } = this
        const shouldBeShown = ([, question]) => {
            if (!question.prereq) return true
            const prereqQuestion = question.prereq.question
            const answerShouldBe = question.prereq.answer
            const answerIs = state.questionValues[prereqQuestion]
            const parentIsShown = shouldBeShown([null, questions[prereqQuestion]])

            return answerShouldBe === answerIs && parentIsShown
        }
        const shownQuestions = Object.entries(questions).filter(shouldBeShown)
        const shownRecommendations = getRecommended(this.state.questionValues).map(id => recommendations[id])
        const renderedRecommendations = shownRecommendations.map(this.renderRecommendation)
        const debug = window.location.search === '?debug=true'
        const values = getValues(this.state.questionValues)

        return (
            <div>
                <form>
                    {shownQuestions.map(this.renderQuestion)}
                </form>
                {debug &&
                    <pre>
                        {JSON.stringify(values, null, 2)}
                    </pre>
                }
                <Recommendations recommendations={renderedRecommendations}/>
            </div>
        )
    }
}
