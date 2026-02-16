function withGroup(group, items) {
  return items.map(item => ({ ...item, group }));
}

export const productsData = [

  // ===== PUERTAS =====
  ...withGroup('puertas_metalicas', [
    { name: 'Puerta Metálica', category: 'puertas' },
    { name: 'Puerta principal de metal con estilo de madera', category: 'puertas' },
    { name: 'Puerta principal de metal moderna con accesorios de acero', category: 'puertas' },
    { name: 'Puerta principal de metal con estilo de madera y rejilla decorativa', category: 'puertas' },
    { name: 'Puerta de seguridad en madera veteada con insertos horizontales de acero', category: 'puertas' },

    { name: 'Puerta principal metálica con acabados texturizados e insertos de vidrio traslúcido', category: 'puertas' },
    { name: 'Puerta metálica moderna con inserto de vidrio vertical y franjas de acero', category: 'puertas' },
    { name: 'Puerta metálica estilo madera con insertos de vidrio asimétricos y manillón curvo', category: 'puertas' },
    { name: 'Puerta metálica estilo madera veteada con insertos de vidrio asimétricos y manillón curvo', category: 'puertas' },
 
    { name: 'Puerta metálica residencial con visor vertical lateral de vidrio texturizado y bajorrelieves horizontales', category: 'puertas' },
    { name: 'Puerta metálica de acceso principal con cuatro insertos cuadrados de vidrio, apliques laterales de acero y panel fijo traslúcido', category: 'puertas' },
    { name: 'Puerta metálica plateada con paneles ondulados y secciones de vidrio oscurecido', category: 'puertas' },
    { name: 'Puerta metálica de seguridad negro mate con paneles horizontales y fijo lateral de vidrio templado', category: 'puertas' },
    { name: 'Puerta metálica de alta seguridad con panel central en madera veteada y sección lateral en negro mate', category: 'puertas' },
    

    


    // ===== GARAJE =====
    { name: 'Puerta Seccional', category: 'garaje' },
    { name: 'Portón metálico corredizo de dos hojas con rejilla superior', category: 'garaje' },
    { name: 'Portón de garaje seccional estilo madera con puerta peatonal a juego e insertos de acero', category: 'garaje' },
  ]),

  

  
  ...withGroup('seguridad_electronica', [

  ]),


  ...withGroup('estructuras_metalicas', [
    // ===== COBERTURAS =====
    { name: 'Reja de Seguridad', category: 'coberturas metalicas' },
    { name: 'Coberturas de Aluminio y Madera', category: 'coberturas metalicas' },
    { name: 'Techo parabólico con estructura metálica', category: 'coberturas metalicas' },
    
    // ===== ESCALERAS =====
    { name: 'Escalera de viga central con pasos volados', category: 'escaleras' },
    { name: 'Baranda de acero inoxidable', category: 'escaleras' },
    { name: 'Escalera de zanca central con pasos volados y baranda de cristal templado', category: 'escaleras' },
    { name: 'Baranda de acero inoxidable con tubos horizontales', category: 'escaleras' },
  ]),
];
