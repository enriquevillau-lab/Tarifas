import { CompanyTariff } from '../types';

export const COMPANY_TARIFFS: CompanyTariff[] = [
  {
    id: 'allianz',
    name: 'Allianz (Global Assistance)',
    shortName: 'Allianz',
    color: '#003781',
    logoBadge: 'ALLIANZ',
    tagline: 'Propuesta Tarifa 2024 Vehículos Industriales',
    effectiveDate: '16/07/2024',
    defaultChargeRecargoPercent: 20,
    defaultNocturnoRecargoPercent: 50,
    cubreCarga: true,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 50.0,
    defaultHoraEsperaPrice: 48.1,
    defaultHoraTrabajoPrice: 48.1,
    defaultHoraAyudantePrice: 50.0,
    topeSinIva: 1239.67, // 1500€ con IVA
    specialNotes: [
      'Tope máximo de cobertura: 1.239,67 € + IVA (1.500,00 € Total con IVA)',
      'Recargo vehículo cargado: 20%',
      'Recargo nocturno o festivo: 50% (a partir de las 20:00h y fines de semana/festivos)',
      'Tarifa km con descuento en trayectos > 200 km totales',
      'Hora de rescate mínimo 2 horas',
      'Custodia por día: 15,00 €'
    ],
    vehicleRates: [
      {
        id: 'allianz-3500-10000',
        name: 'De 3.501 Kg a 10.000 Kg MMA',
        salida: 120.0,
        kmPrice: 1.5,
        kmPriceLargo: 1.46,
        kmLargoThreshold: 200,
        urbano: 130.0,
        horaTrabajo: 48.1
      },
      {
        id: 'allianz-10001-20000',
        name: 'De 10.001 Kg a 20.000 Kg MMA',
        salida: 135.0,
        kmPrice: 1.6,
        kmPriceLargo: 1.56,
        kmLargoThreshold: 200,
        urbano: 165.0,
        horaTrabajo: 48.1
      },
      {
        id: 'allianz-20001-40000',
        name: 'De 20.001 Kg a 40.000 Kg MMA',
        salida: 175.0,
        kmPrice: 1.85,
        kmPriceLargo: 1.79,
        kmLargoThreshold: 200,
        urbano: 225.0,
        horaTrabajo: 48.1
      },
      {
        id: 'allianz-cabeza-tractora',
        name: 'Cabeza Tractora',
        salida: 150.0,
        kmPrice: 1.6,
        kmPriceLargo: 1.56,
        kmLargoThreshold: 200,
        urbano: 175.0,
        horaTrabajo: 48.1
      },
      {
        id: 'allianz-autobus',
        name: 'Autobús',
        salida: 175.0,
        kmPrice: 1.85,
        kmPriceLargo: 1.79,
        kmLargoThreshold: 200,
        urbano: 225.0,
        horaTrabajo: 48.1
      },
      {
        id: 'allianz-remolque',
        name: 'Remolque',
        salida: 155.0,
        kmPrice: 1.85,
        kmPriceLargo: 1.79,
        kmLargoThreshold: 200,
        urbano: 175.0,
        horaTrabajo: 48.1
      },
      {
        id: 'allianz-vehiculo-taller',
        name: 'Vehículo Taller Móvil / Piloto (Tarifa Plana)',
        salida: 200.0,
        kmPrice: 0.0,
        urbano: 200.0,
        horaTrabajo: 48.1
      }
    ],
    rescueRates: [
      {
        id: 'allianz-rescate-autopropulsada',
        name: 'Grúa Autopropulsada (Rescate Pesado)',
        salida: 250.0,
        kmPrice: 3.0,
        kmPriceLargo: 2.35,
        kmLargoThreshold: 200,
        horaRescate: 135.0,
        minHoras: 2,
        horaAyudante: 50.0
      }
    ]
  },
  {
    id: 'axa',
    name: 'AXA Assistance',
    shortName: 'AXA',
    color: '#00008f',
    logoBadge: 'AXA',
    tagline: 'Tarifa 2024 Vehículos Industriales',
    effectiveDate: '15/03/2024',
    defaultChargeRecargoPercent: 20,
    defaultNocturnoRecargoPercent: 50,
    cubreCarga: true,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 55.0,
    defaultHoraEsperaPrice: 55.0,
    defaultHoraTrabajoPrice: 54.1,
    defaultHoraAyudantePrice: 45.0,
    topeSinIva: 1530.0,
    specialNotes: [
      'Tope habitual de compañía: 1.530,00 € sin IVA',
      'Desbloqueo estandar: 55,00 € | Hora de espera: 55,00 €',
      'Recargo nocturno 50% a partir de 20:00h y fines de semana / festivos',
      'Recargo vehículo cargado: 20%',
      'Tarifa km largo recorrido con descuento en trayectos > 200 km'
    ],
    vehicleRates: [
      {
        id: 'axa-3500-9000',
        name: 'Camiones de 3,5 Tn a 9 Tn',
        salida: 140.0,
        kmPrice: 1.55,
        kmPriceLargo: 1.4,
        kmLargoThreshold: 200,
        urbano: 140.0
      },
      {
        id: 'axa-2-ejes',
        name: 'Camiones 2 ejes (hasta 18 Tn)',
        salida: 170.0,
        kmPrice: 1.85,
        kmPriceLargo: 1.68,
        kmLargoThreshold: 200,
        urbano: 170.0
      },
      {
        id: 'axa-3-ejes-remolque',
        name: 'Camiones 3 ejes (hasta 26 Tn) / Remolque',
        salida: 190.3,
        kmPrice: 2.0,
        kmPriceLargo: 1.8,
        kmLargoThreshold: 200,
        urbano: 190.3
      },
      {
        id: 'axa-4-ejes',
        name: 'Camiones 4 ejes (hasta 32 Tn)',
        salida: 210.0,
        kmPrice: 2.2,
        kmPriceLargo: 1.98,
        kmLargoThreshold: 200,
        urbano: 210.0
      },
      {
        id: 'axa-cabeza-tractora',
        name: 'Cabeza Tractora',
        salida: 175.0,
        kmPrice: 1.85,
        kmPriceLargo: 1.68,
        kmLargoThreshold: 200,
        urbano: 175.0
      },
      {
        id: 'axa-trailer',
        name: 'Trailer Completo',
        salida: 225.0,
        kmPrice: 2.75,
        kmPriceLargo: 2.45,
        kmLargoThreshold: 200,
        urbano: 225.0
      },
      {
        id: 'axa-autobus',
        name: 'Autobús',
        salida: 250.0,
        kmPrice: 2.25,
        kmPriceLargo: 2.05,
        kmLargoThreshold: 200,
        urbano: 250.0
      },
      {
        id: 'axa-vehiculo-taller',
        name: 'Vehículo Taller',
        salida: 125.0,
        kmPrice: 1.35,
        kmPriceLargo: 1.2,
        kmLargoThreshold: 200,
        horaTrabajo: 54.1
      },
      {
        id: 'axa-especial-adr',
        name: 'Tarifa Especial Vhc Cargado ADR / Animales Vivos',
        salida: 200.0,
        kmPrice: 2.75,
        kmPriceLargo: 2.45,
        kmLargoThreshold: 200
      }
    ],
    rescueRates: [
      {
        id: 'axa-pluma-10tn',
        name: 'Rescate Pluma 10 Tn (Mínimo 2 horas)',
        salida: 180.0,
        kmPrice: 2.1,
        kmPriceLargo: 1.85,
        kmLargoThreshold: 200,
        horaRescate: 130.0,
        minHoras: 2,
        horaAyudante: 45.0
      },
      {
        id: 'axa-pluma-30tn',
        name: 'Rescate Pluma 30 Tn (Mínimo 3 horas)',
        salida: 200.0,
        kmPrice: 2.75,
        kmPriceLargo: 2.45,
        kmLargoThreshold: 200,
        horaRescate: 160.0,
        minHoras: 3,
        horaAyudante: 45.0
      },
      {
        id: 'axa-pluma-60tn',
        name: 'Rescate Pluma 60 Tn (Mínimo 4 horas)',
        salida: 300.0,
        kmPrice: 3.5,
        kmPriceLargo: 3.1,
        kmLargoThreshold: 200,
        horaRescate: 190.0,
        minHoras: 4,
        horaAyudante: 45.0
      }
    ]
  },
  {
    id: 'mapfre',
    name: 'MAPFRE Asistencia',
    shortName: 'MAPFRE',
    color: '#d81e05',
    logoBadge: 'MAPFRE',
    tagline: 'Industrial & Turismos 2026',
    effectiveDate: '01/03/2026',
    defaultChargeRecargoPercent: 0, // MAPFRE no paga carga por defecto según notas
    defaultNocturnoRecargoPercent: 50,
    cubreCarga: false,
    pagaDesbloqueo: false,
    defaultDesbloqueoPrice: 0.0,
    defaultHoraEsperaPrice: 30.7, // 15,35€ cada media hora
    defaultHoraTrabajoPrice: 36.34,
    defaultHoraAyudantePrice: 36.64,
    specialNotes: [
      '⚠️ NOTA IMPORTANTE MAPFRE: "NO PAGAN DESBLOQUEOS, NO PAGA CARGA"',
      'Servicio Urbano incluye radio asignado (25 km)',
      'Tarifas km de largo recorrido (> 200 km) aplicadas automáticamente',
      'Extracciones mínimo 2 horas: 127,38 €',
      'Tiempo de espera (1/2 hora): 15,35 € (30,70 €/hora)',
      'Recargo nocturno / festivo: 50% (20:00h a 08:00h y fines de semana)'
    ],
    vehicleRates: [
      {
        id: 'mapfre-3500-5000',
        name: 'Industrial 3.500 Kg - 5.000 Kg',
        salida: 99.96,
        kmPrice: 1.21,
        kmPriceLargo: 1.08,
        kmLargoThreshold: 200,
        urbano: 177.16
      },
      {
        id: 'mapfre-5001-10000',
        name: 'Industrial 5.001 Kg - 10.000 Kg',
        salida: 120.95,
        kmPrice: 1.36,
        kmPriceLargo: 1.19,
        kmLargoThreshold: 200,
        urbano: 177.16
      },
      {
        id: 'mapfre-10001-15000',
        name: 'Industrial 10.001 Kg - 15.000 Kg',
        salida: 137.03,
        kmPrice: 1.7,
        kmPriceLargo: 1.5,
        kmLargoThreshold: 200,
        urbano: 177.16
      },
      {
        id: 'mapfre-15001-20000',
        name: 'Industrial 15.001 Kg - 20.000 Kg',
        salida: 160.45,
        kmPrice: 2.08,
        kmPriceLargo: 1.84,
        kmLargoThreshold: 200,
        urbano: 177.16
      },
      {
        id: 'mapfre-gt20000',
        name: 'Industrial > 20.000 Kg',
        salida: 224.48,
        kmPrice: 2.48,
        kmPriceLargo: 2.16,
        kmLargoThreshold: 200,
        urbano: 177.16
      },
      {
        id: 'mapfre-autocares',
        name: 'Autocares',
        salida: 160.46,
        kmPrice: 2.05,
        kmPriceLargo: 1.77,
        kmLargoThreshold: 200,
        urbano: 177.16
      },
      {
        id: 'mapfre-vehiculo-taller',
        name: 'Vehículo Taller',
        salida: 54.03,
        kmPrice: 0.9,
        kmPriceLargo: 0.8,
        kmLargoThreshold: 200,
        urbano: 61.41,
        horaTrabajo: 36.34
      },
      {
        id: 'mapfre-turismo-moto',
        name: 'Turismo y Motocicletas',
        salida: 38.85,
        kmPrice: 1.21,
        kmPriceLargo: 1.08,
        kmLargoThreshold: 200,
        urbano: 51.91
      },
      {
        id: 'mapfre-monovolumen',
        name: 'Monovolúmenes 7 o más plazas',
        salida: 40.19,
        kmPrice: 1.23,
        kmPriceLargo: 1.09,
        kmLargoThreshold: 200,
        urbano: 53.37
      },
      {
        id: 'mapfre-todoterreno',
        name: 'Automóviles Todo Terreno / 4x4',
        salida: 41.5,
        kmPrice: 1.24,
        kmPriceLargo: 1.1,
        kmLargoThreshold: 200,
        urbano: 54.83
      },
      {
        id: 'mapfre-ind-ligero',
        name: 'Industriales Ligeros > 2.500 kg',
        salida: 47.53,
        kmPrice: 1.33,
        kmPriceLargo: 1.18,
        kmLargoThreshold: 200,
        urbano: 63.5
      },
      {
        id: 'mapfre-grandes-dim',
        name: 'Vehículos de Grandes Dimensiones / Gemela',
        salida: 64.06,
        kmPrice: 1.48,
        kmPriceLargo: 1.3,
        kmLargoThreshold: 200,
        urbano: 84.05
      }
    ],
    rescueRates: [
      {
        id: 'mapfre-extraccion-ind',
        name: 'Extracción / Rescate Industrial (Mínimo 2 horas)',
        salida: 127.38,
        kmPrice: 2.48,
        kmPriceLargo: 2.16,
        kmLargoThreshold: 200,
        horaRescate: 63.69,
        minHoras: 2,
        horaAyudante: 36.64
      },
      {
        id: 'mapfre-extraccion-turismo-pluma',
        name: 'Extracción con Pluma Autocargante Turismo',
        salida: 62.16,
        kmPrice: 1.48,
        kmPriceLargo: 1.3,
        kmLargoThreshold: 200,
        horaRescate: 31.12,
        minHoras: 1,
        horaAyudante: 36.64
      }
    ]
  },
  {
    id: 'arag',
    name: 'ARAG Asistencia',
    shortName: 'ARAG',
    color: '#ffcc00',
    logoBadge: 'ARAG',
    tagline: 'Tarifa Servicio Grúa y Rescate',
    effectiveDate: 'Tarifa Vigente',
    defaultChargeRecargoPercent: 0, // #NO CUBRE CARGA
    defaultNocturnoRecargoPercent: 30, // 30% a partir 18h, 40% fin de semana
    cubreCarga: false,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 48.1,
    defaultHoraEsperaPrice: 48.1,
    defaultHoraTrabajoPrice: 48.1,
    defaultHoraAyudantePrice: 38.0,
    specialNotes: [
      'Desbloqueo: 48,10 €',
      '⚠️ NOTA: "#NO CUBRE CARGA"',
      'Tarifa km largo recorrido (> 200 km) con precio especial',
      'Recargo nocturno: 30% a partir de las 18:00 horas',
      'Recargo festivos y fin de semana: 40%',
      'Incluye desvolcaje estandar por tipo de vehículo'
    ],
    vehicleRates: [
      {
        id: 'arag-camion-3000',
        name: 'Camiones hasta 3.000 kg',
        salida: 80.0,
        kmPrice: 1.35,
        kmPriceLargo: 1.2,
        kmLargoThreshold: 200,
        horaTrabajo: 30.05,
        horaAyudante: 38.0,
        desvolcaje: 150.25
      },
      {
        id: 'arag-camion-6000',
        name: 'Camiones hasta 6.000 kg',
        salida: 100.0,
        kmPrice: 1.5,
        kmPriceLargo: 1.35,
        kmLargoThreshold: 200,
        horaTrabajo: 36.1,
        horaAyudante: 38.0,
        desvolcaje: 180.3
      },
      {
        id: 'arag-2-ejes-18t',
        name: 'Camiones de dos ejes hasta 18 TN',
        salida: 150.0,
        kmPrice: 1.8,
        kmPriceLargo: 1.62,
        kmLargoThreshold: 200,
        horaTrabajo: 48.1,
        horaAyudante: 38.0,
        desvolcaje: 240.4
      },
      {
        id: 'arag-3-ejes-26t',
        name: 'Camiones de tres ejes hasta 26 TN',
        salida: 175.0,
        kmPrice: 1.95,
        kmPriceLargo: 1.76,
        kmLargoThreshold: 200,
        horaTrabajo: 54.1,
        horaAyudante: 38.0,
        desvolcaje: 240.4
      },
      {
        id: 'arag-4-ejes',
        name: 'Camiones de cuatro ejes',
        salida: 200.0,
        kmPrice: 2.1,
        kmPriceLargo: 1.9,
        kmLargoThreshold: 200,
        horaTrabajo: 54.1,
        horaAyudante: 38.0,
        desvolcaje: 240.4
      },
      {
        id: 'arag-omnibus',
        name: 'Ómnibus / Autocares',
        salida: 200.0,
        kmPrice: 2.1,
        kmPriceLargo: 1.9,
        kmLargoThreshold: 200,
        horaTrabajo: 54.1,
        horaAyudante: 38.0,
        desvolcaje: 240.4
      },
      {
        id: 'arag-coche-taller',
        name: 'Coche Taller Mecánico',
        salida: 60.1,
        kmPrice: 1.1,
        kmPriceLargo: 0.98,
        kmLargoThreshold: 200,
        horaTrabajo: 48.1,
        horaAyudante: 38.0
      },
      {
        id: 'arag-vehiculo-especial',
        name: 'Vehículos Especiales / 2 plantas / mercancías',
        salida: 250.0,
        kmPrice: 2.75,
        kmPriceLargo: 2.45,
        kmLargoThreshold: 200,
        horaTrabajo: 130.0,
        horaAyudante: 38.0
      }
    ],
    rescueRates: [
      {
        id: 'arag-rescate-urbano',
        name: 'Servicio Rescate (Salida + 2h trabajo + Plus)',
        salida: 150.0,
        kmPrice: 1.95,
        kmPriceLargo: 1.76,
        kmLargoThreshold: 200,
        horaRescate: 54.1,
        minHoras: 2,
        horaAyudante: 38.0,
        desvolcaje: 240.4
      }
    ]
  },
  {
    id: 'race',
    name: 'RACE Asistencia (Caser / Pelayo)',
    shortName: 'RACE',
    color: '#fed100',
    logoBadge: 'RACE',
    tagline: 'Propuesta Tarifa RACE Asistencia 2024',
    effectiveDate: '28/05/2024',
    defaultChargeRecargoPercent: 25,
    defaultNocturnoRecargoPercent: 50,
    cubreCarga: true,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 52.0,
    defaultHoraEsperaPrice: 52.0,
    defaultHoraTrabajoPrice: 52.0,
    defaultHoraAyudantePrice: 45.0,
    specialNotes: [
      'Desbloqueo: 52,00 € | Hora de ayudante: 45,00 €',
      'Tarifa km largo recorrido (> 200 km) con descuento',
      'Recargo vehículo cargado: 25%',
      'Recargo nocturno 50% (20:00h - 08:00h y fines de semana / festivos)',
      'Custodia vehículo a partir del 2º día: 18,00 € / día'
    ],
    vehicleRates: [
      {
        id: 'race-furgon-taller',
        name: 'Servicio Furgón Taller',
        salida: 65.0,
        kmPrice: 1.15,
        kmPriceLargo: 1.05,
        kmLargoThreshold: 200,
        urbano: 100.0,
        horaTrabajo: 52.0
      },
      {
        id: 'race-hasta-8000',
        name: 'Hasta 8.000 kg / Rescate Turismo Pluma',
        salida: 150.0,
        kmPrice: 1.7,
        kmPriceLargo: 1.55,
        kmLargoThreshold: 200,
        urbano: 180.0
      },
      {
        id: 'race-hasta-18000',
        name: 'Hasta 18.000 kg',
        salida: 160.0,
        kmPrice: 1.9,
        kmPriceLargo: 1.72,
        kmLargoThreshold: 200,
        urbano: 200.0
      },
      {
        id: 'race-cabezas-tractoras',
        name: 'Cabezas Tractoras',
        salida: 160.0,
        kmPrice: 1.9,
        kmPriceLargo: 1.72,
        kmLargoThreshold: 200,
        urbano: 180.0
      },
      {
        id: 'race-3-4-ejes',
        name: 'Camiones 3 o 4 Ejes',
        salida: 180.0,
        kmPrice: 2.1,
        kmPriceLargo: 1.9,
        kmLargoThreshold: 200,
        urbano: 200.0
      },
      {
        id: 'race-trailer',
        name: 'Trailer + 32.000 kg',
        salida: 210.0,
        kmPrice: 2.5,
        kmPriceLargo: 2.25,
        kmLargoThreshold: 200,
        urbano: 280.0
      },
      {
        id: 'race-autocares',
        name: 'Autocares',
        salida: 250.0,
        kmPrice: 2.5,
        kmPriceLargo: 2.25,
        kmLargoThreshold: 200,
        urbano: 280.0
      },
      {
        id: 'race-semirremolque',
        name: 'Traslado de Semirremolque',
        salida: 160.0,
        kmPrice: 1.9,
        kmPriceLargo: 1.72,
        kmLargoThreshold: 200,
        urbano: 180.0
      },
      {
        id: 'race-gruas-autopropulsada',
        name: 'Grúas Autopropulsada',
        salida: 235.0,
        kmPrice: 2.6,
        kmPriceLargo: 2.35,
        kmLargoThreshold: 200,
        urbano: 275.0
      }
    ],
    rescueRates: [
      {
        id: 'race-pluma-8t',
        name: 'Rescate Hora Pluma Turismo / hasta 8T (mín 2h)',
        salida: 150.0,
        kmPrice: 1.7,
        kmPriceLargo: 1.55,
        kmLargoThreshold: 200,
        horaRescate: 100.0,
        minHoras: 2,
        horaAyudante: 45.0
      },
      {
        id: 'race-pluma-pesada',
        name: 'Rescate Hora Pluma Pesada (mín 3h)',
        salida: 210.0,
        kmPrice: 2.5,
        kmPriceLargo: 2.25,
        kmLargoThreshold: 200,
        horaRescate: 150.0,
        minHoras: 3,
        horaAyudante: 45.0
      },
      {
        id: 'race-pluma-autopropulsada',
        name: 'Rescate Grúa Autopropulsada Especial (mín 3h)',
        salida: 235.0,
        kmPrice: 2.6,
        kmPriceLargo: 2.35,
        kmLargoThreshold: 200,
        horaRescate: 250.0,
        minHoras: 3,
        horaAyudante: 45.0
      }
    ]
  },
  {
    id: 'asitur',
    name: 'Asitur Asistencia',
    shortName: 'Asitur',
    color: '#005b94',
    logoBadge: 'ASITUR',
    tagline: 'Tarifas Asitur Asistencia',
    effectiveDate: '01/2026',
    defaultChargeRecargoPercent: 25,
    defaultNocturnoRecargoPercent: 50,
    cubreCarga: true,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 53.56,
    defaultHoraEsperaPrice: 41.2,
    defaultHoraTrabajoPrice: 46.35,
    defaultHoraAyudantePrice: 39.14,
    specialNotes: [
      'Rescate mínimo estipulado: 92,70 € (2 horas x 46,35 €/h)',
      'Desbloqueo frenos / transmisión: 53,56 €',
      'Hora de espera: 41,20 € | Hora ayudante: 39,14 €',
      'Tarifa km largo recorrido (> 200 km) con descuento',
      'Recargo vehículo cargado: 25%',
      'Recargo nocturno / festivo: 50%',
      'Grúa autopropulsada aplica tarifa Allianz'
    ],
    vehicleRates: [
      {
        id: 'asitur-5tn',
        name: 'Camiones hasta 5 TN',
        salida: 103.0,
        kmPrice: 1.24,
        kmPriceLargo: 1.1,
        kmLargoThreshold: 200,
        horaTrabajo: 46.35,
        minHorasRescate: 2,
        rescateMinimo: 92.70
      },
      {
        id: 'asitur-8tn',
        name: 'Camiones hasta 8 TN',
        salida: 123.6,
        kmPrice: 1.55,
        kmPriceLargo: 1.38,
        kmLargoThreshold: 200,
        horaTrabajo: 46.35,
        minHorasRescate: 2,
        rescateMinimo: 92.70
      },
      {
        id: 'asitur-15tn',
        name: 'Camiones hasta 15 TN',
        salida: 123.6,
        kmPrice: 1.65,
        kmPriceLargo: 1.48,
        kmLargoThreshold: 200,
        horaTrabajo: 46.35,
        minHorasRescate: 2,
        rescateMinimo: 92.70
      },
      {
        id: 'asitur-20tn',
        name: 'Camiones hasta 20 TN (incluye Autocaravanas)',
        salida: 154.5,
        kmPrice: 1.85,
        kmPriceLargo: 1.65,
        kmLargoThreshold: 200,
        horaTrabajo: 46.35,
        minHorasRescate: 2,
        rescateMinimo: 92.70
      },
      {
        id: 'asitur-26tn',
        name: 'Camiones hasta 26 TN (3 Ejes)',
        salida: 164.8,
        kmPrice: 1.96,
        kmPriceLargo: 1.75,
        kmLargoThreshold: 200,
        horaTrabajo: 46.35,
        minHorasRescate: 2,
        rescateMinimo: 92.70
      },
      {
        id: 'asitur-36tn',
        name: 'Camiones hasta 36 TN (4 Ejes / Semirremolque)',
        salida: 201.37,
        kmPrice: 2.42,
        kmPriceLargo: 2.15,
        kmLargoThreshold: 200,
        horaTrabajo: 46.35,
        minHorasRescate: 2,
        rescateMinimo: 92.70
      },
      {
        id: 'asitur-tractora',
        name: 'Cabezas Tractoras',
        salida: 154.5,
        kmPrice: 1.85,
        kmPriceLargo: 1.65,
        kmLargoThreshold: 200,
        horaTrabajo: 46.35,
        minHorasRescate: 2,
        rescateMinimo: 92.70
      },
      {
        id: 'asitur-trailer',
        name: 'Trailer Completo',
        salida: 201.37,
        kmPrice: 2.42,
        kmPriceLargo: 2.15,
        kmLargoThreshold: 200,
        horaTrabajo: 46.35,
        minHorasRescate: 2,
        rescateMinimo: 92.70
      },
      {
        id: 'asitur-autocar-micro',
        name: 'Autocar Microbús',
        salida: 154.5,
        kmPrice: 1.85,
        kmPriceLargo: 1.65,
        kmLargoThreshold: 200,
        horaTrabajo: 46.35,
        minHorasRescate: 2,
        rescateMinimo: 92.70
      },
      {
        id: 'asitur-autocar',
        name: 'Autocares',
        salida: 175.1,
        kmPrice: 2.16,
        kmPriceLargo: 1.92,
        kmLargoThreshold: 200,
        horaTrabajo: 46.35,
        minHorasRescate: 2,
        rescateMinimo: 92.70
      },
      {
        id: 'asitur-autocar-3ejes',
        name: 'Autocares 3 Ejes o Articulado',
        salida: 192.61,
        kmPrice: 2.58,
        kmPriceLargo: 2.3,
        kmLargoThreshold: 200,
        horaTrabajo: 46.35,
        minHorasRescate: 2,
        rescateMinimo: 92.70
      },
      {
        id: 'asitur-coche-taller',
        name: 'Coche Taller Industrial',
        salida: 64.38,
        kmPrice: 1.04,
        kmPriceLargo: 0.92,
        kmLargoThreshold: 200,
        horaTrabajo: 46.35,
        rescateMinimo: 92.70
      }
    ],
    rescueRates: [
      {
        id: 'asitur-rescate-estandar',
        name: 'Rescate Asitur (Mínimo 2 horas = 92,70 €)',
        salida: 154.5,
        kmPrice: 1.85,
        kmPriceLargo: 1.65,
        kmLargoThreshold: 200,
        horaRescate: 46.35,
        minHoras: 2,
        rescateMinimo: 92.70,
        horaAyudante: 39.14
      }
    ]
  },
  {
    id: 'europ',
    name: 'Europ Assistance',
    shortName: 'Europ Ass.',
    color: '#002b66',
    logoBadge: 'EUROP',
    tagline: 'Propuesta Tarifas Vehículos Industriales',
    effectiveDate: 'Tarifa Vigente',
    defaultChargeRecargoPercent: 20,
    defaultNocturnoRecargoPercent: 40,
    cubreCarga: true,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 45.0,
    defaultHoraEsperaPrice: 45.0,
    defaultHoraTrabajoPrice: 48.0,
    defaultHoraAyudantePrice: 36.17,
    specialNotes: [
      'Desbloqueo: 45,00 € | Ayudante: 36,17 € | Hora Rescate: 135,00 €',
      'Urbano incluye radio 10 km (20 km totales)',
      'Largo recorrido a partir de 250 km totales',
      'Recargo nocturno o festivo: 40% (20:00h - 08:00h y fines de semana)'
    ],
    vehicleRates: [
      {
        id: 'europ-8000',
        name: 'Camiones hasta 8.000 kgs',
        salida: 129.78,
        kmPrice: 1.91,
        kmPriceLargo: 1.7,
        kmLargoThreshold: 250,
        urbano: 193.6
      },
      {
        id: 'europ-18000',
        name: 'Camiones hasta 18.000 kgs o cabezas tractoras',
        salida: 173.04,
        kmPrice: 2.01,
        kmPriceLargo: 1.81,
        kmLargoThreshold: 250,
        urbano: 216.3
      },
      {
        id: 'europ-3ejes',
        name: 'Camiones de 3 ejes (18000 - 26000 kg)',
        salida: 194.67,
        kmPrice: 2.17,
        kmPriceLargo: 1.97,
        kmLargoThreshold: 250,
        urbano: 227.12
      },
      {
        id: 'europ-4ejes',
        name: 'Camiones de 4 ejes (26000 - 32000 kg)',
        salida: 216.3,
        kmPrice: 2.23,
        kmPriceLargo: 2.07,
        kmLargoThreshold: 250,
        urbano: 270.38
      },
      {
        id: 'europ-trailer',
        name: 'Trailer completo (> 32000 kg)',
        salida: 216.3,
        kmPrice: 2.79,
        kmPriceLargo: 2.4,
        kmLargoThreshold: 250,
        urbano: 293.33
      },
      {
        id: 'europ-autocares',
        name: 'Autocares',
        salida: 216.3,
        kmPrice: 2.58,
        kmPriceLargo: 2.27,
        kmLargoThreshold: 250,
        urbano: 270.38
      },
      {
        id: 'europ-semirremolque',
        name: 'Traslado semirremolque',
        salida: 189.26,
        kmPrice: 2.01,
        kmPriceLargo: 1.81,
        kmLargoThreshold: 250,
        urbano: 216.3
      },
      {
        id: 'europ-vehiculo-taller',
        name: 'Vehículo Taller',
        salida: 75.71,
        kmPrice: 1.51,
        kmPriceLargo: 1.39,
        urbano: 140.8,
        horaTrabajo: 48.0
      }
    ],
    rescueRates: [
      {
        id: 'europ-rescate-autopropulsada',
        name: 'Rescate con Grúa Autopropulsada',
        salida: 216.3,
        kmPrice: 2.58,
        kmPriceLargo: 2.27,
        kmLargoThreshold: 250,
        horaRescate: 135.0,
        minHoras: 1,
        horaAyudante: 36.17
      }
    ]
  },
  {
    id: 'interpartner',
    name: 'Inter Partner Assistance',
    shortName: 'Inter Partner',
    color: '#0b397b',
    logoBadge: 'IPA',
    tagline: 'Tarifa Inter Partner Assistance Remolque & Rescate',
    effectiveDate: 'Tarifa Vigente',
    defaultChargeRecargoPercent: 20,
    defaultNocturnoRecargoPercent: 45,
    cubreCarga: true,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 52.0,
    defaultHoraEsperaPrice: 52.0,
    defaultHoraTrabajoPrice: 45.0,
    defaultHoraAyudantePrice: 35.0,
    specialNotes: [
      'Desbloqueo: 52,00 € | Hora de espera o trabajo: 52,00 € | Ayudante: 35,00 €',
      'Tarifa km largo recorrido (> 200 km) con descuento',
      'Recargo nocturno o festivo: 45% (20:00h - 08:00h)',
      'Rescate con pluma tarifado según tonelaje de pluma'
    ],
    vehicleRates: [
      {
        id: 'ipa-3501-6000',
        name: 'De 3.501 Kg hasta 6.000 Kg PMA',
        salida: 93.6,
        kmPrice: 1.24,
        kmPriceLargo: 1.1,
        kmLargoThreshold: 200
      },
      {
        id: 'ipa-6001-10000',
        name: 'De 6.001 Kg hasta 10.000 Kg PMA / Tractores',
        salida: 135.2,
        kmPrice: 1.66,
        kmPriceLargo: 1.48,
        kmLargoThreshold: 200
      },
      {
        id: 'ipa-cabeza-tractora',
        name: 'Cabeza Tractora',
        salida: 139.87,
        kmPrice: 1.75,
        kmPriceLargo: 1.55,
        kmLargoThreshold: 200
      },
      {
        id: 'ipa-10001-15000',
        name: 'De 10.001 Kg hasta 15.000 Kg PMA',
        salida: 147.71,
        kmPrice: 1.84,
        kmPriceLargo: 1.64,
        kmLargoThreshold: 200
      },
      {
        id: 'ipa-15001-20000',
        name: 'De 15.001 Kg hasta 20.000 Kg PMA',
        salida: 163.12,
        kmPrice: 2.03,
        kmPriceLargo: 1.82,
        kmLargoThreshold: 200
      },
      {
        id: 'ipa-20001-26000',
        name: 'De 20.001 Kg hasta 26.000 Kg PMA',
        salida: 186.34,
        kmPrice: 2.25,
        kmPriceLargo: 2.0,
        kmLargoThreshold: 200
      },
      {
        id: 'ipa-26001-35000',
        name: 'De 26.001 Kg hasta 35.000 Kg PMA',
        salida: 209.46,
        kmPrice: 2.41,
        kmPriceLargo: 2.15,
        kmLargoThreshold: 200
      },
      {
        id: 'ipa-35001-42000',
        name: 'De 35.001 Kg hasta 42.000 Kg PMA',
        salida: 248.22,
        kmPrice: 2.71,
        kmPriceLargo: 2.4,
        kmLargoThreshold: 200
      },
      {
        id: 'ipa-vehiculo-taller',
        name: 'Vehículo Taller',
        salida: 58.0,
        kmPrice: 0.77,
        kmPriceLargo: 0.69,
        kmLargoThreshold: 200,
        horaTrabajo: 45.0
      },
      {
        id: 'ipa-autocares',
        name: 'Autocares',
        salida: 248.22,
        kmPrice: 2.56,
        kmPriceLargo: 2.28,
        kmLargoThreshold: 200
      }
    ],
    rescueRates: [
      {
        id: 'ipa-pluma-15t',
        name: 'Rescate Pluma 15 TN (mín 1h)',
        salida: 73.0,
        kmPrice: 1.66,
        kmPriceLargo: 1.48,
        kmLargoThreshold: 200,
        horaRescate: 55.0,
        minHoras: 1,
        horaAyudante: 35.0
      },
      {
        id: 'ipa-pluma-30t',
        name: 'Rescate Pluma 30 TN (mín 1h)',
        salida: 105.0,
        kmPrice: 1.84,
        kmPriceLargo: 1.64,
        kmLargoThreshold: 200,
        horaRescate: 80.0,
        minHoras: 1,
        horaAyudante: 35.0
      },
      {
        id: 'ipa-pluma-40t',
        name: 'Rescate Pluma 40 TN (mín 2h)',
        salida: 125.0,
        kmPrice: 2.08,
        kmPriceLargo: 1.85,
        kmLargoThreshold: 200,
        horaRescate: 100.0,
        minHoras: 2,
        horaAyudante: 35.0
      },
      {
        id: 'ipa-pluma-50t',
        name: 'Rescate Pluma 50 TN (mín 2h)',
        salida: 135.0,
        kmPrice: 3.09,
        kmPriceLargo: 2.75,
        kmLargoThreshold: 200,
        horaRescate: 150.0,
        minHoras: 2,
        horaAyudante: 35.0
      }
    ]
  },
  {
    id: 'racc',
    name: 'RACC Asistencia',
    shortName: 'RACC',
    color: '#ffdd00',
    logoBadge: 'RACC',
    tagline: 'Tarifas RACC Agosto 2025',
    effectiveDate: '08/2025',
    defaultChargeRecargoPercent: 20,
    defaultNocturnoRecargoPercent: 45,
    cubreCarga: true,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 58.55,
    defaultHoraEsperaPrice: 40.98,
    defaultHoraTrabajoPrice: 50.36,
    defaultHoraAyudantePrice: 50.36,
    specialNotes: [
      'Desbloqueo frenos / transmisión: 58,55 € (Laboral) / 84,89 € (Noct/Fest)',
      'Hora extracción (mín 2h): 128,79 €',
      'Recargo nocturno y festivo: 45% (20:00h - 08:00h)',
      'Urbano radio 10 km (20 km totales)'
    ],
    vehicleRates: [
      {
        id: 'racc-3500-5000',
        name: '3.500 KG - 5.000 KG',
        salida: 135.23,
        kmPrice: 1.86,
        kmPriceLargo: 1.64,
        urbano: 135.23
      },
      {
        id: 'racc-5001-10000',
        name: '5.001 KG - 10.000 KG',
        salida: 178.6,
        kmPrice: 2.11,
        kmPriceLargo: 1.87,
        urbano: 178.6
      },
      {
        id: 'racc-10001-15000',
        name: '10.001 KG - 15.000 KG',
        salida: 189.07,
        kmPrice: 2.19,
        kmPriceLargo: 1.95,
        urbano: 189.07
      },
      {
        id: 'racc-15001-20000',
        name: '15.001 KG - 20.000 KG',
        salida: 206.11,
        kmPrice: 2.44,
        kmPriceLargo: 2.16,
        urbano: 206.11
      },
      {
        id: 'racc-gt20000',
        name: '> 20.000 KG / Remolque',
        salida: 257.63,
        kmPrice: 2.79,
        kmPriceLargo: 2.46,
        urbano: 257.63
      },
      {
        id: 'racc-cabeza-microbus',
        name: 'Cabeza Tractora y Microbús',
        salida: 202.61,
        kmPrice: 2.44,
        kmPriceLargo: 2.16,
        urbano: 202.61
      },
      {
        id: 'racc-autocares',
        name: 'Autocares',
        salida: 245.92,
        kmPrice: 2.88,
        kmPriceLargo: 2.56,
        urbano: 245.92
      },
      {
        id: 'racc-coche-taller',
        name: 'Coche Taller (Reparación in situ)',
        salida: 67.88,
        kmPrice: 1.16,
        kmPriceLargo: 1.02,
        kmLargoThreshold: 200,
        horaTrabajo: 50.36
      }
    ],
    rescueRates: [
      {
        id: 'racc-extraccion',
        name: 'Hora de Extracción / Rescate (Mínimo 2 horas)',
        salida: 189.07,
        kmPrice: 2.44,
        kmPriceLargo: 2.16,
        kmLargoThreshold: 200,
        horaRescate: 128.79,
        minHoras: 2,
        horaAyudante: 50.36
      }
    ]
  },
  {
    id: 'ima',
    name: 'IMA Ibérica Asistencia',
    shortName: 'IMA Ibérica',
    color: '#0d47a1',
    logoBadge: 'IMA',
    tagline: 'Tarifa Asistencia Camiones / Autobuses 2026',
    effectiveDate: '15/12/2025',
    defaultChargeRecargoPercent: 20,
    defaultNocturnoRecargoPercent: 50,
    cubreCarga: true,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 55.0,
    defaultHoraEsperaPrice: 55.0,
    defaultHoraTrabajoPrice: 55.0,
    defaultHoraAyudantePrice: 45.0,
    specialNotes: [
      'Desbloqueo: 55,00 € | Hora espera: 55,00 €',
      'Tarifa km largo recorrido (> 200 km) con descuento',
      'Recargo carga: 20% | Recargo nocturno: 50%',
      '⚠️ RESCATES GRÚA PLUMA: Aplicar siempre tarifa > 30 TN (Salida 158€, Km 3,50€, Hora 200€ min 4h)'
    ],
    vehicleRates: [
      {
        id: 'ima-35-5tn',
        name: 'Vehículo de 3,5 Tn - 5 Tn',
        salida: 125.0,
        kmPrice: 1.55,
        kmPriceLargo: 1.38,
        kmLargoThreshold: 200
      },
      {
        id: 'ima-5-10tn',
        name: 'Vehículo de 5 Tn - 10 Tn',
        salida: 160.0,
        kmPrice: 1.8,
        kmPriceLargo: 1.6,
        kmLargoThreshold: 200
      },
      {
        id: 'ima-gt10tn',
        name: 'Vehículo de > 10 Tn / Remolque / Autocaravana',
        salida: 200.0,
        kmPrice: 2.35,
        kmPriceLargo: 2.1,
        kmLargoThreshold: 200
      },
      {
        id: 'ima-coche-taller',
        name: 'Coche Taller',
        salida: 75.0,
        kmPrice: 1.1,
        kmPriceLargo: 0.98,
        kmLargoThreshold: 200
      },
      {
        id: 'ima-cabeza-tractora',
        name: 'Cabeza Tractora',
        salida: 185.0,
        kmPrice: 1.95,
        kmPriceLargo: 1.75,
        kmLargoThreshold: 200
      },
      {
        id: 'ima-autobus',
        name: 'Autobús',
        salida: 250.0,
        kmPrice: 2.75,
        kmPriceLargo: 2.45,
        kmLargoThreshold: 200
      }
    ],
    rescueRates: [
      {
        id: 'ima-pluma-10tn',
        name: 'Rescate Grúa Pluma 10 Tn (mín 3h)',
        salida: 175.0,
        kmPrice: 2.0,
        kmPriceLargo: 1.8,
        kmLargoThreshold: 200,
        horaRescate: 135.0,
        minHoras: 3,
        horaAyudante: 45.0
      },
      {
        id: 'ima-pluma-20tn',
        name: 'Rescate Grúa Pluma 20 Tn (mín 3h)',
        salida: 225.0,
        kmPrice: 2.75,
        kmPriceLargo: 2.45,
        kmLargoThreshold: 200,
        horaRescate: 180.0,
        minHoras: 3,
        horaAyudante: 45.0
      },
      {
        id: 'ima-pluma-gt30tn',
        name: 'Rescate Grúa Pluma > 30 Tn (Recomendado IMA - mín 4h)',
        salida: 158.0,
        kmPrice: 3.5,
        kmPriceLargo: 3.1,
        kmLargoThreshold: 200,
        horaRescate: 200.0,
        minHoras: 4,
        horaAyudante: 45.0
      }
    ]
  },
  {
    id: 'aide',
    name: 'AIDE Asistencia',
    shortName: 'AIDE',
    color: '#e52d27',
    logoBadge: 'AIDE',
    tagline: 'Tarifa AIDE Asistencia Vehículos Pesados',
    effectiveDate: 'Tarifa Vigente',
    defaultChargeRecargoPercent: 20,
    defaultNocturnoRecargoPercent: 50,
    cubreCarga: true,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 45.9,
    defaultHoraEsperaPrice: 36.72,
    defaultHoraTrabajoPrice: 51.0,
    defaultHoraAyudantePrice: 36.72,
    specialNotes: [
      'Desbloqueo: 45,90 € | Hora de espera: 36,72 € | Hora ayudante: 36,72 €',
      'Tarifa km largo recorrido (> 200 km) con descuento',
      'Recargo nocturno y festivo: 50% (a partir de 20:00h)'
    ],
    vehicleRates: [
      {
        id: 'aide-5tn',
        name: 'Camiones hasta 5 TN',
        salida: 72.4,
        kmPrice: 1.02,
        kmPriceLargo: 0.92,
        kmLargoThreshold: 200,
        horaTrabajo: 51.0
      },
      {
        id: 'aide-9tn',
        name: 'Camiones hasta 9 TN',
        salida: 108.6,
        kmPrice: 1.02,
        kmPriceLargo: 0.92,
        kmLargoThreshold: 200,
        horaTrabajo: 56.1
      },
      {
        id: 'aide-15tn',
        name: 'Camiones hasta 15 TN',
        salida: 129.29,
        kmPrice: 1.16,
        kmPriceLargo: 1.05,
        kmLargoThreshold: 200,
        horaTrabajo: 66.3
      },
      {
        id: 'aide-3ejes',
        name: 'Camiones 3 Ejes',
        salida: 181.0,
        kmPrice: 1.42,
        kmPriceLargo: 1.28,
        kmLargoThreshold: 200,
        horaTrabajo: 71.4
      },
      {
        id: 'aide-4ejes',
        name: 'Camiones 4 Ejes',
        salida: 222.37,
        kmPrice: 1.9,
        kmPriceLargo: 1.7,
        kmLargoThreshold: 200,
        horaTrabajo: 86.7
      },
      {
        id: 'aide-tractoras',
        name: 'Tractoras',
        salida: 144.8,
        kmPrice: 1.84,
        kmPriceLargo: 1.65,
        kmLargoThreshold: 200,
        horaTrabajo: 86.7
      },
      {
        id: 'aide-trailer',
        name: 'Trailer Completo',
        salida: 258.57,
        kmPrice: 2.19,
        kmPriceLargo: 1.96,
        kmLargoThreshold: 200,
        horaTrabajo: 142.8
      },
      {
        id: 'aide-microbus',
        name: 'Autocar Microbús',
        salida: 144.8,
        kmPrice: 1.47,
        kmPriceLargo: 1.32,
        kmLargoThreshold: 200,
        horaTrabajo: 86.7
      },
      {
        id: 'aide-autocar-2ejes',
        name: 'Autocar 2 Ejes',
        salida: 165.48,
        kmPrice: 1.84,
        kmPriceLargo: 1.65,
        kmLargoThreshold: 200,
        horaTrabajo: 107.1
      },
      {
        id: 'aide-autocar-3ejes',
        name: 'Autocar 3 Ejes',
        salida: 217.2,
        kmPrice: 2.04,
        kmPriceLargo: 1.82,
        kmLargoThreshold: 200,
        horaTrabajo: 127.5
      },
      {
        id: 'aide-autocar-2plantas',
        name: 'Autocar 2 Plantas',
        salida: 258.57,
        kmPrice: 2.45,
        kmPriceLargo: 2.18,
        kmLargoThreshold: 200,
        horaTrabajo: 142.8
      }
    ],
    rescueRates: [
      {
        id: 'aide-rescate-heavy',
        name: 'Rescate Heavy AIDE (mín 2h)',
        salida: 181.0,
        kmPrice: 1.9,
        kmPriceLargo: 1.7,
        kmLargoThreshold: 200,
        horaRescate: 86.7,
        minHoras: 2,
        horaAyudante: 36.72
      }
    ]
  },
  {
    id: 'avinatan',
    name: 'Avinatan PIA',
    shortName: 'Avinatan',
    color: '#00796b',
    logoBadge: 'AVINATAN',
    tagline: 'Propuesta Tarifa Avinatan PIA 2024',
    effectiveDate: '22/02/2024',
    defaultChargeRecargoPercent: 20,
    defaultNocturnoRecargoPercent: 50,
    cubreCarga: true,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 46.75,
    defaultHoraEsperaPrice: 42.55,
    defaultHoraTrabajoPrice: 42.55,
    defaultHoraAyudantePrice: 42.55,
    specialNotes: [
      'Desbloqueo de frenos: 46,75 € | Espera / Ayudante: 42,55 €',
      'Tarifa km largo recorrido (> 200 km) con descuento',
      'Recargo vehículo cargado: 20%',
      'Recargo nocturno: 50% (20:00h - 08:00h)'
    ],
    vehicleRates: [
      {
        id: 'avinatan-3501-6000',
        name: 'De 3.501 kg hasta 6.000 kg PMA',
        salida: 118.15,
        kmPrice: 1.45,
        kmPriceLargo: 1.3,
        kmLargoThreshold: 200,
        horaTrabajo: 49.6
      },
      {
        id: 'avinatan-6001-10000',
        name: 'De 6.001 kg hasta 10.000 kg PMA',
        salida: 141.75,
        kmPrice: 1.5,
        kmPriceLargo: 1.35,
        kmLargoThreshold: 200,
        horaTrabajo: 64.55
      },
      {
        id: 'avinatan-cabeza-tractora',
        name: 'Cabeza Tractora',
        salida: 165.4,
        kmPrice: 1.7,
        kmPriceLargo: 1.52,
        kmLargoThreshold: 200,
        horaTrabajo: 64.55
      },
      {
        id: 'avinatan-10001-15000',
        name: 'De 10.001 kg hasta 15.000 kg PMA',
        salida: 165.4,
        kmPrice: 1.75,
        kmPriceLargo: 1.56,
        kmLargoThreshold: 200,
        horaTrabajo: 69.3
      },
      {
        id: 'avinatan-15001-20000',
        name: 'De 15.001 kg hasta 20.000 kg PMA',
        salida: 165.4,
        kmPrice: 1.75,
        kmPriceLargo: 1.56,
        kmLargoThreshold: 200,
        horaTrabajo: 84.0
      },
      {
        id: 'avinatan-20001-26000',
        name: 'De 20.001 kg hasta 26.000 kg PMA',
        salida: 189.0,
        kmPrice: 1.9,
        kmPriceLargo: 1.7,
        kmLargoThreshold: 200,
        horaTrabajo: 84.0
      },
      {
        id: 'avinatan-26001-35000',
        name: 'De 26.001 kg hasta 35.000 kg PMA',
        salida: 198.45,
        kmPrice: 2.1,
        kmPriceLargo: 1.88,
        kmLargoThreshold: 200,
        horaTrabajo: 139.05
      },
      {
        id: 'avinatan-35001-42000',
        name: 'De 35.001 kg hasta 42.000 kg PMA',
        salida: 198.45,
        kmPrice: 2.1,
        kmPriceLargo: 1.88,
        kmLargoThreshold: 200,
        horaTrabajo: 139.05
      },
      {
        id: 'avinatan-autocares',
        name: 'Autocares',
        salida: 236.25,
        kmPrice: 2.1,
        kmPriceLargo: 1.88,
        kmLargoThreshold: 200,
        horaTrabajo: 139.05
      },
      {
        id: 'avinatan-coche-taller',
        name: 'Coche Taller In Situ',
        salida: 66.15,
        kmPrice: 0.95,
        kmPriceLargo: 0.85,
        kmLargoThreshold: 200,
        horaTrabajo: 42.55
      }
    ],
    rescueRates: [
      {
        id: 'avinatan-pluma-15t',
        name: 'Rescate Pluma 15 TN (3.500 kg)',
        salida: 94.5,
        kmPrice: 1.7,
        kmPriceLargo: 1.5,
        kmLargoThreshold: 200,
        horaRescate: 66.15,
        minHoras: 1,
        horaAyudante: 42.55
      },
      {
        id: 'avinatan-pluma-30t',
        name: 'Rescate Pluma 30 TN (5.000 kg)',
        salida: 165.4,
        kmPrice: 1.9,
        kmPriceLargo: 1.7,
        kmLargoThreshold: 200,
        horaRescate: 94.5,
        minHoras: 1,
        horaAyudante: 42.55
      },
      {
        id: 'avinatan-pluma-50t',
        name: 'Rescate Pluma 50 TN (10.000 kg)',
        salida: 236.25,
        kmPrice: 2.95,
        kmPriceLargo: 2.65,
        kmLargoThreshold: 200,
        horaRescate: 127.05,
        minHoras: 2,
        horaAyudante: 42.55
      },
      {
        id: 'avinatan-pluma-80t',
        name: 'Rescate Pluma 80 TN (25.000 kg)',
        salida: 283.5,
        kmPrice: 3.5,
        kmPriceLargo: 3.1,
        kmLargoThreshold: 200,
        horaRescate: 189.0,
        minHoras: 2,
        horaAyudante: 42.55
      }
    ]
  },
  {
    id: 'servireac',
    name: 'ServiReac / Reac Asistencia',
    shortName: 'ServiReac',
    color: '#00838f',
    logoBadge: 'REAC',
    tagline: 'Tarifas Válida Reac Asistencia',
    effectiveDate: '01/09/2024',
    defaultChargeRecargoPercent: 20,
    defaultNocturnoRecargoPercent: 50,
    cubreCarga: true,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 57.0, // importe equivalente hora trabajo
    defaultHoraEsperaPrice: 57.0,
    defaultHoraTrabajoPrice: 57.0,
    defaultHoraAyudantePrice: 57.0,
    specialNotes: [
      'Desbloqueo = importe equivalente hora trabajo (57,00 €)',
      'Recargo vehículo cargado: 20%',
      'Recargo nocturno y festivo: 50% (20:00h - 08:00h)'
    ],
    vehicleRates: [
      {
        id: 'reac-3500-10000',
        name: 'De 3.500 kg a 10.000 kg',
        salida: 150.0,
        kmPrice: 1.65,
        kmPriceLargo: 1.5,
        kmLargoThreshold: 300,
        urbano: 180.0,
        horaTrabajo: 120.0
      },
      {
        id: 'reac-10001-20000',
        name: 'De 10.001 kg a 20.000 kg',
        salida: 175.0,
        kmPrice: 1.85,
        kmPriceLargo: 1.75,
        kmLargoThreshold: 300,
        urbano: 200.0,
        horaTrabajo: 136.72
      },
      {
        id: 'reac-3ejes',
        name: 'Camiones de 3 ejes',
        salida: 210.0,
        kmPrice: 2.15,
        kmPriceLargo: 2.0,
        kmLargoThreshold: 300,
        urbano: 230.0,
        horaTrabajo: 153.25
      },
      {
        id: 'reac-4ejes',
        name: 'Camiones de 4 ejes',
        salida: 210.0,
        kmPrice: 2.5,
        kmPriceLargo: 2.36,
        kmLargoThreshold: 300,
        urbano: 260.0,
        horaTrabajo: 155.71
      },
      {
        id: 'reac-remolque',
        name: 'Remolque (con nuestra cabeza tractora)',
        salida: 185.0,
        kmPrice: 1.95,
        kmPriceLargo: 1.88,
        kmLargoThreshold: 300,
        urbano: 200.0
      },
      {
        id: 'reac-cabeza-tractora',
        name: 'Cabeza Tractora',
        salida: 175.0,
        kmPrice: 1.85,
        kmPriceLargo: 1.75,
        kmLargoThreshold: 300,
        urbano: 200.0,
        horaTrabajo: 136.72
      },
      {
        id: 'reac-autobus',
        name: 'Autobús o autocar',
        salida: 250.0,
        kmPrice: 2.5,
        kmPriceLargo: 2.4,
        kmLargoThreshold: 300,
        urbano: 300.0,
        horaTrabajo: 160.0
      },
      {
        id: 'reac-coche-piloto',
        name: 'Coche Piloto / Taller',
        salida: 80.22,
        kmPrice: 1.04,
        kmPriceLargo: 0.95,
        kmLargoThreshold: 300,
        urbano: 100.0,
        horaTrabajo: 57.0
      }
    ],
    rescueRates: [
      {
        id: 'reac-rescate-especial',
        name: 'Rescate Especial ServiReac (Mínimo 2 horas)',
        salida: 210.0,
        kmPrice: 2.5,
        horaRescate: 120.0,
        minHoras: 2,
        horaAyudante: 57.0
      }
    ]
  },
  {
    id: 'gruas_torre_oro',
    name: 'Grúas Torre del Oro (Tarifa Oficial / Particulares)',
    shortName: 'Torre del Oro',
    color: '#d32f2f',
    logoBadge: 'TORRE ORO',
    tagline: 'Tarifas 2026 Vehículos Industriales, Turismos & Rescate',
    effectiveDate: '2026',
    defaultChargeRecargoPercent: 25,
    defaultNocturnoRecargoPercent: 50,
    cubreCarga: true,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 75.0,
    defaultHoraEsperaPrice: 105.0,
    defaultHoraTrabajoPrice: 75.0,
    defaultHoraAyudantePrice: 70.0,
    specialNotes: [
      'Tarifa Base Oficial de Grúas Torre del Oro S.L (Sevilla, Huelva, Cádiz, Málaga, Granada, Córdoba)',
      'Desbloqueo: 75,00 € | Hora mano de obra: 75,00 € | Hora espera: 105,00 €',
      'Tarifa km largo recorrido (> 200 km) con descuento',
      'Recargo vehículo cargado: 25%',
      'Recargo nocturno o festivo: 50% (fuera de 08:00 a 17:00 / 18:00)',
      'Grúa Autopropulsada Rescate: Mínimo 6 horas (180 €/h) | Ayudante mín 6h (70 €/h)'
    ],
    vehicleRates: [
      {
        id: 'gto-turismo',
        name: 'Turismo',
        salida: 75.0,
        kmPrice: 1.1,
        kmPriceLargo: 0.98,
        kmLargoThreshold: 200,
        urbano: 70.0,
        horaTrabajo: 65.0
      },
      {
        id: 'gto-furgon-3500',
        name: 'Furgón hasta 3.500 kg',
        salida: 90.0,
        kmPrice: 1.5,
        kmPriceLargo: 1.35,
        kmLargoThreshold: 200,
        urbano: 125.0,
        horaTrabajo: 65.0
      },
      {
        id: 'gto-3501-10000',
        name: 'De 3.501 Kgs a 10.000 Kgs MMA',
        salida: 200.0,
        kmPrice: 2.6,
        kmPriceLargo: 2.3,
        kmLargoThreshold: 200,
        urbano: 215.0,
        horaTrabajo: 73.0
      },
      {
        id: 'gto-10001-20000',
        name: 'De 10.001 Kgs a 20.000 Kgs MMA / Microbús',
        salida: 235.0,
        kmPrice: 2.6,
        kmPriceLargo: 2.3,
        kmLargoThreshold: 200,
        urbano: 265.0,
        horaTrabajo: 73.0
      },
      {
        id: 'gto-20001-40000',
        name: 'De 20.001 Kgs a 40.000 Kgs MMA',
        salida: 265.0,
        kmPrice: 2.85,
        kmPriceLargo: 2.55,
        kmLargoThreshold: 200,
        urbano: 330.0,
        horaTrabajo: 73.0
      },
      {
        id: 'gto-cabeza-tractora',
        name: 'Cabeza Tractora',
        salida: 235.0,
        kmPrice: 2.6,
        kmPriceLargo: 2.3,
        kmLargoThreshold: 200,
        urbano: 265.0,
        horaTrabajo: 73.0
      },
      {
        id: 'gto-autobus',
        name: 'Autobús',
        salida: 265.0,
        kmPrice: 3.15,
        kmPriceLargo: 2.8,
        kmLargoThreshold: 200,
        urbano: 330.0,
        horaTrabajo: 73.0
      },
      {
        id: 'gto-autobus-15m',
        name: 'Autobús 15 mt / Gusanos / 2 Plantas',
        salida: 330.0,
        kmPrice: 3.25,
        kmPriceLargo: 2.9,
        kmLargoThreshold: 200,
        urbano: 380.0,
        horaTrabajo: 73.0
      },
      {
        id: 'gto-remolque',
        name: 'Remolque',
        salida: 235.0,
        kmPrice: 2.6,
        kmPriceLargo: 2.3,
        kmLargoThreshold: 200,
        urbano: 265.0,
        horaTrabajo: 73.0
      },
      {
        id: 'gto-centauro',
        name: 'Centauro (Salida especial)',
        salida: 525.0,
        kmPrice: 5.4,
        kmPriceLargo: 4.8,
        kmLargoThreshold: 200,
        urbano: 525.0,
        horaTrabajo: 73.0
      },
      {
        id: 'gto-vehiculo-taller',
        name: 'Vehículo Taller Móvil / Piloto',
        salida: 135.0,
        kmPrice: 2.8,
        kmPriceLargo: 2.5,
        kmLargoThreshold: 200,
        urbano: 170.0,
        horaTrabajo: 75.0
      }
    ],
    rescueRates: [
      {
        id: 'gto-rescate-autopropulsada-6h',
        name: 'Grúa Autopropulsada Rescate (2026 - Mínimo 6 horas)',
        salida: 330.0,
        kmPrice: 4.7,
        kmPriceLargo: 4.2,
        kmLargoThreshold: 200,
        horaRescate: 180.0,
        minHoras: 6,
        horaAyudante: 70.0
      },
      {
        id: 'gto-rescate-particulares-2h',
        name: 'Grúa Autopropulsada Particulares (Mínimo 2 horas)',
        salida: 315.0,
        kmPrice: 3.75,
        kmPriceLargo: 3.35,
        kmLargoThreshold: 200,
        horaRescate: 165.0,
        minHoras: 2,
        horaAyudante: 55.0
      }
    ]
  },
  {
    id: 'veinsur',
    name: 'Veinsur S.A.U',
    shortName: 'Veinsur',
    color: '#1565c0',
    logoBadge: 'VEINSUR',
    tagline: 'Tarifa Veinsur S.A.U - Grúas Torre del Oro',
    effectiveDate: 'Tarifa Vigente',
    defaultChargeRecargoPercent: 20,
    defaultNocturnoRecargoPercent: 40,
    cubreCarga: true,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 71.5,
    defaultHoraEsperaPrice: 66.0,
    defaultHoraTrabajoPrice: 66.0,
    defaultHoraAyudantePrice: 49.5,
    specialNotes: [
      'Desbloqueo: 71,50 € | Hora mano de obra: 66,00 € | Ayudante: 49,50 €',
      'Tarifa km largo recorrido (> 200 km) con descuento',
      'Recargo vehículo cargado: 20%',
      'Recargo nocturno o festivo: 40% (08:00h a 18:00h diurno)',
      'Grúa Autopropulsada Rescate: Salida 286,00 €, Km 3,41 €, Hora mín 2h (170,50 €/h)'
    ],
    vehicleRates: [
      {
        id: 'veinsur-turismo',
        name: 'Turismo',
        salida: 77.0,
        kmPrice: 1.1,
        kmPriceLargo: 0.98,
        kmLargoThreshold: 200,
        urbano: 71.5
      },
      {
        id: 'veinsur-furgon',
        name: 'Furgón hasta 3.500 kg',
        salida: 88.0,
        kmPrice: 1.54,
        kmPriceLargo: 1.38,
        kmLargoThreshold: 200,
        urbano: 121.0
      },
      {
        id: 'veinsur-3501-10000',
        name: 'De 3.501 Kgs. a 10.000 Kgs. MMA',
        salida: 148.5,
        kmPrice: 1.98,
        kmPriceLargo: 1.76,
        kmLargoThreshold: 200,
        urbano: 225.5
      },
      {
        id: 'veinsur-10001-20000',
        name: 'De 10.001 Kgs. a 20.000 Kgs. MMA',
        salida: 187.0,
        kmPrice: 2.2,
        kmPriceLargo: 1.95,
        kmLargoThreshold: 200,
        urbano: 247.5
      },
      {
        id: 'veinsur-20001-40000',
        name: 'De 20.001 Kgs. a 40.000 Kgs. MMA',
        salida: 247.5,
        kmPrice: 2.75,
        kmPriceLargo: 2.45,
        kmLargoThreshold: 200,
        urbano: 330.0
      },
      {
        id: 'veinsur-cabeza-tractora',
        name: 'Cabeza Tractora',
        salida: 187.0,
        kmPrice: 2.15,
        kmPriceLargo: 1.92,
        kmLargoThreshold: 200,
        urbano: 247.5
      },
      {
        id: 'veinsur-autobus',
        name: 'Autobús',
        salida: 220.0,
        kmPrice: 2.75,
        kmPriceLargo: 2.45,
        kmLargoThreshold: 200,
        urbano: 330.0
      },
      {
        id: 'veinsur-remolque',
        name: 'Remolque',
        salida: 187.0,
        kmPrice: 2.15,
        kmPriceLargo: 1.92,
        kmLargoThreshold: 200,
        urbano: 225.5
      },
      {
        id: 'veinsur-vehiculo-taller',
        name: 'Vehículo Taller Móvil / Piloto',
        salida: 82.5,
        kmPrice: 1.21,
        kmPriceLargo: 1.08,
        kmLargoThreshold: 200,
        urbano: 148.5
      }
    ],
    rescueRates: [
      {
        id: 'veinsur-rescate-autopropulsada',
        name: 'Grúa Autopropulsada Rescate (Mínimo 2 horas)',
        salida: 286.0,
        kmPrice: 3.41,
        kmPriceLargo: 3.05,
        kmLargoThreshold: 200,
        horaRescate: 170.5,
        minHoras: 2,
        horaAyudante: 49.5
      }
    ]
  },
  {
    id: 'ada',
    name: 'ADA Asistencia',
    shortName: 'ADA',
    color: '#e65100',
    logoBadge: 'ADA',
    tagline: 'Tarifas ADA Vehículos Industriales',
    effectiveDate: '26/09/2019',
    defaultChargeRecargoPercent: 20,
    defaultNocturnoRecargoPercent: 40,
    cubreCarga: true,
    pagaDesbloqueo: true,
    defaultDesbloqueoPrice: 49.65,
    defaultHoraEsperaPrice: 41.77,
    defaultHoraTrabajoPrice: 41.77,
    defaultHoraAyudantePrice: 37.82,
    specialNotes: [
      'Desbloqueo de frenos: 49,65 € | Hora de espera: 41,77 € | Ayudante: 37,82 €',
      'Tarifa km largo recorrido (> 200 km) con descuento',
      'Recargo nocturno y festivo: 40% (20:00h - 08:00h)'
    ],
    vehicleRates: [
      {
        id: 'ada-3500-6000',
        name: 'De 3.500 Kg hasta 6.000 Kg',
        salida: 93.6,
        kmPrice: 1.07,
        kmPriceLargo: 0.96,
        kmLargoThreshold: 200
      },
      {
        id: 'ada-6001-10000',
        name: 'De 6.001 Kg hasta 10.000 Kg',
        salida: 125.0,
        kmPrice: 1.25,
        kmPriceLargo: 1.12,
        kmLargoThreshold: 200
      },
      {
        id: 'ada-10001-15000',
        name: 'De 10.001 Kg hasta 15.000 Kg',
        salida: 147.0,
        kmPrice: 1.47,
        kmPriceLargo: 1.32,
        kmLargoThreshold: 200
      },
      {
        id: 'ada-15001-20000',
        name: 'De 15.001 Kg hasta 20.000 Kg',
        salida: 163.0,
        kmPrice: 1.5,
        kmPriceLargo: 1.35,
        kmLargoThreshold: 200
      },
      {
        id: 'ada-20001-26000',
        name: 'De 20.001 Kg hasta 26.000 Kg',
        salida: 186.0,
        kmPrice: 1.65,
        kmPriceLargo: 1.48,
        kmLargoThreshold: 200
      },
      {
        id: 'ada-26001-35000',
        name: 'De 26.001 Kg hasta 35.000 Kg',
        salida: 209.0,
        kmPrice: 2.06,
        kmPriceLargo: 1.85,
        kmLargoThreshold: 200
      },
      {
        id: 'ada-35001-42000',
        name: 'De 35.001 Kg hasta 42.000 Kg',
        salida: 248.0,
        kmPrice: 2.06,
        kmPriceLargo: 1.85,
        kmLargoThreshold: 200
      },
      {
        id: 'ada-cabeza-tractora',
        name: 'Cabeza Tractora',
        salida: 140.0,
        kmPrice: 1.5,
        kmPriceLargo: 1.35,
        kmLargoThreshold: 200
      },
      {
        id: 'ada-autocares',
        name: 'Autocares',
        salida: 212.53,
        kmPrice: 1.79,
        kmPriceLargo: 1.6,
        kmLargoThreshold: 200
      },
      {
        id: 'ada-coche-taller',
        name: 'Coche Taller In Situ',
        salida: 62.11,
        kmPrice: 0.92,
        kmPriceLargo: 0.82,
        kmLargoThreshold: 200,
        horaTrabajo: 41.77
      }
    ],
    rescueRates: [
      {
        id: 'ada-pluma-15t',
        name: 'Pluma 15 TN (3.500 kg - mín 1h)',
        salida: 73.0,
        kmPrice: 1.66,
        kmPriceLargo: 1.48,
        kmLargoThreshold: 200,
        horaRescate: 55.0,
        minHoras: 1,
        horaAyudante: 37.82
      },
      {
        id: 'ada-pluma-30t',
        name: 'Pluma 30 TN (5.000 kg - mín 1h)',
        salida: 105.0,
        kmPrice: 1.84,
        kmPriceLargo: 1.64,
        kmLargoThreshold: 200,
        horaRescate: 80.0,
        minHoras: 1,
        horaAyudante: 37.82
      },
      {
        id: 'ada-pluma-40t',
        name: 'Pluma 40 TN (10.000 kg - mín 2h)',
        salida: 125.0,
        kmPrice: 2.08,
        kmPriceLargo: 1.85,
        kmLargoThreshold: 200,
        horaRescate: 100.0,
        minHoras: 2,
        horaAyudante: 37.82
      },
      {
        id: 'ada-pluma-50t',
        name: 'Pluma 50 TN (25.000 kg - mín 2h)',
        salida: 135.0,
        kmPrice: 3.09,
        kmPriceLargo: 2.75,
        kmLargoThreshold: 200,
        horaRescate: 150.0,
        minHoras: 2,
        horaAyudante: 37.82
      }
    ]
  }
];

export const DEFAULT_COMPANY_SETTINGS = {
  companyName: 'GRÚAS TORRE DEL ORO S.L.',
  cifNif: 'B41610429',
  phone: '600 000 000',
  address: 'Sevilla - Huelva - Andalucía',
  whatsappMessageHeader: '🚨 *PRESUPUESTO DE ASISTENCIA / RESCATE - GRÚAS TORRE DEL ORO*',
  defaultIvaPercent: 21
};
