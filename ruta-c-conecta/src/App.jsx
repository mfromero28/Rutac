import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase.js";

// ==================== DATOS REALES MAGDALENA ====================
const MUNICIPIOS_BARRIOS = {
  "Santa Marta": ["Centro Histórico", "El Rodadero", "Mamatoco", "Taganga", "Gaira", "Pescaíto", "Bastidas", "Las Américas", "Bello Horizonte", "Los Almendros", "Timayui", "San Jorge", "Pozos Colorados", "El Parque", "Villa del Mar"],
  "Ciénaga": ["Centro", "El Carmen", "Barrio Obrero", "Villa Estadio", "El Paraíso", "Pescadores", "La Ye"],
  "Fundación": ["Centro", "El Progreso", "La Esperanza", "Barrio Nuevo", "La Granja", "El Bosque"],
  "Zona Bananera": ["Sevilla", "Río Frío", "Guacamayal", "Orihueca", "Prado Sevilla", "Riofrío", "Tucurinca", "Varela", "Santa Rosalía", "Palomar"],
  "Aracataca": ["Centro", "El Recreo", "Barrio Nuevo", "La Esperanza", "Las Flores"],
  "El Banco": ["Centro", "Barrio Arriba", "Barrio Abajo", "El Carmen", "Las Flores", "Villa Nueva"],
  "Pivijay": ["Centro", "Barrio Nuevo", "La Esperanza", "El Progreso"],
  "El Retén": ["Centro", "Barrio Nuevo", "La Unión"],
  "Plato": ["Centro", "La Playita", "Barrio Nuevo", "El Paraíso", "Villa del Río"],
  "Ariguaní (El Difícil)": ["El Difícil", "Centro", "Barrio Nuevo", "La Esperanza"],
  "Guamal": ["Centro", "Barrio Nuevo", "Las Flores"],
  "Sabanas de San Ángel": ["San Ángel", "Centro", "Barrio Nuevo"],
  "Nueva Granada": ["Centro", "Barrio Nuevo", "El Progreso"],
  "Chibolo": ["Centro", "Barrio Nuevo", "Las Flores"],
  "Tenerife": ["Centro", "Barrio Nuevo", "La Esperanza"],
  "Salamina": ["Centro", "Barrio Nuevo"],
  "Concordia": ["Centro", "Barrio Nuevo"],
  "Pedraza": ["Centro", "Barrio Nuevo"],
  "Sitionuevo": ["Centro", "Barrio Nuevo", "La Barra"],
  "Remolino": ["Centro", "Barrio Nuevo"],
  "Zapayán": ["Punta de Piedras", "Centro", "Barrio Nuevo"],
  "Puebloviejo": ["Centro", "La Barra", "Isla del Rosario"],
  "Algarrobo": ["Centro", "Barrio Nuevo"],
  "Santa Ana": ["Centro", "Barrio Nuevo", "El Paraíso"],
  "San Zenón": ["Centro", "Barrio Nuevo"],
};

const MUNICIPIOS = Object.keys(MUNICIPIOS_BARRIOS);

const CLUSTERS = [
  { id: "TURISMO", titulo: "Turismo", color: "#0F9B8E", bgLight: "#E1F5EE", total: 245 },
  { id: "LOGISTICA", titulo: "Logística", color: "#185FA5", bgLight: "#E6F1FB", total: 198 },
  { id: "BANANO", titulo: "Banano", color: "#BA7517", bgLight: "#FAEEDA", total: 245 },
  { id: "PALMA", titulo: "Palma de Aceite", color: "#3B6D11", bgLight: "#EAF3DE", total: 147 },
  { id: "ARTESANIAS", titulo: "Artesanías", color: "#9C27B0", bgLight: "#F3E5F5", total: 67 },
  { id: "PESCA", titulo: "Pesca y Acuicultura", color: "#00BCD4", bgLight: "#E0F7FA", total: 89 },
  { id: "COMERCIO", titulo: "Comercio y Servicios", color: "#4CAF50", bgLight: "#E8F5E9", total: 312 },
  { id: "CONSTRUCCION", titulo: "Construcción", color: "#FF9800", bgLight: "#FFF3E0", total: 134 },
];

const ETAPAS = ["Ideación", "Inicio", "Crecimiento", "Consolidación", "Madurez", "Expansión"];
const TIEMPOS = ["Menos de 1 año", "1 a 3 años", "3 a 5 años", "5 a 10 años", "Más de 10 años"];

// ==================== DATOS REALES DE LOS CSVS ====================
const REGISTRADOS_MUESTRA = [{"s": "ARQUISOLUCIONES DURAN LTDA. EN LIQUIDACION", "mu": "Santa Marta", "ci": "F4111", "ni": "800170340", "ma": "27560", "em": "arquisolduran@hotmail.com", "te": "3106402317", "to": "Sociedad Limitada", "es": "Matricula Activa"}, {"s": "INMOBILIARIA CARMEN LTDA EN LIQUIDACION", "mu": "Santa Marta", "ci": "L6810", "ni": "8190041846", "ma": "65950", "em": "contabilidad@daabon.com.co", "te": "4328121", "to": "Sociedad Limitada", "es": "Matricula Activa"}, {"s": "COMERCIALIZADORA DEL CARIBE S.A. COMECSA S.A. EN LIQUIDACION", "mu": "Santa Marta", "ci": "H4923", "ni": "8190045025", "ma": "68261", "em": "", "te": "4212964", "to": "Sociedad Anonima", "es": "Matricula Activa"}, {"s": "IMCO LTDA EN LIQUIDACION", "mu": "Santa Marta", "ci": "C2592", "ni": "8190064595", "ma": "80487", "em": "imco-ltda@outlook.es", "te": "3043329732", "to": "Sociedad Limitada", "es": "Matricula Activa"}, {"s": "SIA MOUKARZEL LTDA EN LIQUIDACION", "mu": "Santa Marta", "ci": "H5229", "ni": "8190068075", "ma": "83051", "em": "", "te": "4310782", "to": "Sociedad Limitada", "es": "Matricula Activa"}, {"s": "SERVITEMPORAL LTDA EN LIQUIDACION", "mu": "Santa Marta", "ci": "N7830", "ni": "8190067923", "ma": "83293", "em": "servitemporal2025@outlook.es", "te": "4211260", "to": "Sociedad Limitada", "es": "Matricula Activa"}, {"s": "COMERCIALIZADORA INTERNACIONAL PRODUCTOS DE LA SIERRA NEVADA S.A. EN LIQUIDACION", "mu": "Santa Marta", "ci": "G4610", "ni": "9001630652", "ma": "104914", "em": "", "te": "4314595", "to": "Sociedad Anonima", "es": "Matricula Activa"}, {"s": "CIA. UNIVERSAL DE INVERSIONES S. A. EN LIQUIDACION", "mu": "Santa Marta", "ci": "F4290", "ni": "9001919211", "ma": "107400", "em": "", "te": "4311003", "to": "Sociedad Anonima", "es": "Matricula Activa"}, {"s": "AGROPECUARIA EL TAMBOR GNECCO ESPINOSA & CIA S EN C. EN LIQUIDACION", "mu": "Santa Marta", "ci": "M7010", "ni": "8001968933", "ma": "30264", "em": "", "te": "4211534", "to": "Sociedad de Comandita Simple", "es": "Matricula Activa"}, {"s": "BEGU S.A. EN LIQUIDACION", "mu": "Santa Marta", "ci": "", "ni": "8190013791", "ma": "47906", "em": "begusa.bg@gmail.com", "te": "4214563", "to": "Sociedad Anonima", "es": "Matricula Activa"}, {"s": "MEJIA SAN JUAN MELVIS MERCEDES", "mu": "Santa Marta", "ci": "", "ni": "365577389", "ma": "97248", "em": "", "te": "4332386", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "INVERSIONES SANTA INES S.A. EN LIQUIDACION", "mu": "Santa Marta", "ci": "A0150", "ni": "8000415213", "ma": "16638", "em": "liquidacioninversionesantaines@gmail.com", "te": "3008369125", "to": "Sociedad Anonima", "es": "Matricula Activa"}, {"s": "DANGON RUSSO Y CIA. LIMITADA. EN LIQUIDACION", "mu": "Santa Marta", "ci": "A0122", "ni": "8917031198", "ma": "14468", "em": "drussoltda@gmail.com", "te": "3012961616", "to": "Sociedad Limitada", "es": "Matricula Activa"}, {"s": "IMPULSOS S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "M7020", "ni": "9007281539", "ma": "159010", "em": "impulsos@outlook.es", "te": "3145548626", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "EMPRESARIOS DEL AGRO ASOCIADOS S.A.S. EN LIQUIDACION", "mu": "El Reten", "ci": "A0161", "ni": "9006651576", "ma": "154764", "em": "empreagros2013@hotmail.com", "te": "3002283616", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "INVERSIONES JUCARO S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "G4663", "ni": "9008126729", "ma": "166121", "em": "jrochawilches@yahoo.com", "te": "3045494624", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ZAVA SOLUCIONES GASTRONOMICAS S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "M7020", "ni": "9005288506", "ma": "140755", "em": "soniaochoaparedes0121@gmail.com", "te": "4208155", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "AGENCIA DE VIAJES Y TURISMO ECO GREEN ADVENTURE S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "N7911", "ni": "9006189034", "ma": "150179", "em": "ecogreenadventure@gmail.com", "te": "4206694", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "STILOS DECORACIONES S.A.S.", "mu": "Santa Marta", "ci": "C1690", "ni": "8000515982", "ma": "17087", "em": "stilosdecoraciones@hotmail.com", "te": "4231615", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "COMPAÑIA DEL ACUEDUCTO Y ALCANTARILLADO METROPOLITANO DE SANTA MARTA S.A. E.S.P. EN LIQUIDACION", "mu": "Santa Marta", "ci": "E3600", "ni": "8000801779", "ma": "19023", "em": "kpadilla@sypauditores.info", "te": "3116852537", "to": "Sociedad Anonima", "es": "Matricula Activa"}, {"s": "EMPRESARIOS ASOCIADOS DE APUESTAS PERMANENTES DEL DEPARTAMENTO DEL MAGDALENA S.A. APOSMAR S.A. EN LIQUIDACION", "mu": "Santa Marta", "ci": "R9200", "ni": "8917025426", "ma": "12085", "em": "notificacionesaposmar@gmail.com", "te": "3012419881", "to": "Sociedad Anonima", "es": "Matricula Activa"}, {"s": "ONLY SYSTEMS S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "J6202", "ni": "9007936489", "ma": "165059", "em": "elturcofarid@gmail.com", "te": "3016650647", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ARQUITECTOS & INGENIEROS S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "G4663", "ni": "9005873933", "ma": "147036", "em": "arquitectos.ingenieros.sas@gmail.com", "te": "4331273", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "INVERSIONES HOTELERAS DEL CARIBE S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "I5511", "ni": "9004950301", "ma": "136953", "em": "assi.moosh@gmail.com", "te": "3116911219", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ORGANIZACION EXPLORA S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "P8560", "ni": "9009290526", "ma": "174225", "em": "director@organizacionexplora.com", "te": "4300456", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ABOGADOS ASOCIADOS CONSULTORES S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "M6910", "ni": "9005087455", "ma": "138219", "em": "maryduica@gmail.com", "te": "4359735", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "PH CONSULTORES CONTABLES Y JURIDICOS S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "M6910", "ni": "9009888104", "ma": "179408", "em": "phconsultoressas@gmail.com", "te": "4239095", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "LEGON PUBLICIDAD & MEDIOS S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "M7310", "ni": "9011842946", "ma": "203442", "em": "gerente@legonpublicidad.com", "te": "4353477", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "INVERSIONES CARIBE TROPICAL Y CIA LTDA EN LIQUIDACION", "mu": "Ciénaga", "ci": "G4721", "ni": "8190030660", "ma": "58990", "em": "depositariosaesas@gmail.com", "te": "3219517545", "to": "Sociedad Limitada", "es": "Matricula Activa"}, {"s": "LEGAL BASIS CERVANTES NAVARRO CABARCAS  SOCIEDAD POR ACCIONES SIMPLIFICADAS EN LIQUIDACION", "mu": "Santa Marta", "ci": "M6910", "ni": "9003426681", "ma": "122912", "em": "mtcervantes2@hotmail.com", "te": "4211020", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ECOBLUE SERVICIOS AMBIENTALES S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "M7210", "ni": "9011459678", "ma": "197474", "em": "ecoblue.serviciosambientales@gmail.com", "te": "3013981775", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "INVERSIONES ANDORRA S.A.S EN LIQUIDACION", "mu": "Santa Marta", "ci": "F4290", "ni": "9003931600", "ma": "127824", "em": "inv.andorra@gmail.com", "te": "3174379981", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ACTIVOS CON VALOR AGREGADO S.A.S EN LIQUIDACION", "mu": "Santa Marta", "ci": "G4719", "ni": "9012774064", "ma": "215730", "em": "gustavohernandezlopez@hotmail.com", "te": "4207948", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "SERVICIO TRACTO NORTE S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "G4520", "ni": "9007774295", "ma": "163913", "em": "finanzas@serviciotractonorte.com", "te": "4366114", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "CONTRATOS OPERACIONES Y OBRAS S.A.S EN LIQUIDACION", "mu": "Santa Marta", "ci": "G4663", "ni": "9007715200", "ma": "163458", "em": "conoobras@hotmail.com", "te": "4200863", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "NG INVERSIONES DEL CARIBE S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "M7310", "ni": "9013842374", "ma": "228218", "em": "naxly2020@gmail.com", "te": "3115773169", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "SOLUCIONES INN S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "M6910", "ni": "9013902544", "ma": "229184", "em": "solucionesinsas@gmail.com", "te": "3005301345", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "EQUIMEDIS PLUS SAS EN LIQUIDACION", "mu": "Santa Marta", "ci": "G4645", "ni": "9002156853", "ma": "222653", "em": "gerencia@smp.com.co", "te": "4310905", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "SERVISUMINISTROS MACONDO S.A.S EN LIQUIDACION", "mu": "Aracataca", "ci": "A0163", "ni": "9013487942", "ma": "223813", "em": "alejomorasuarez1957@gmail.com", "te": "3045548762", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "INVERSIONES & ASESORIAS FMP S.A.S.", "mu": "Santa Marta", "ci": "M7490", "ni": "9014478431", "ma": "237466", "em": "marye53@hotmail.com", "te": "3022909257", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "COTES BERTIS ERIC DE JESUS", "mu": "Santa Marta", "ci": "A0122", "ni": "771691922", "ma": "169424", "em": "jesuscb3@hotmail.com", "te": "4395167", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "INVERSIONES CAYENNE S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "I5519", "ni": "9006281579", "ma": "173619", "em": "pedrazarh@gmail.com", "te": "6804822", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "SOLUCIONES INDUSTRIALES Y MINERAS S.A.S.", "mu": "Santa Marta", "ci": "E3700", "ni": "9000306636", "ma": "90719", "em": "lacastano@simltda.com.co", "te": "4221281", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "DE LA ESPRIELLA MONTERROSA JOSE DAVID", "mu": "El Banco", "ci": "G4719", "ni": "11408164377", "ma": "241632", "em": "jose88_18@hotmail.com", "te": "3043304263", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "CASTRO MARTINEZ MARIA ALEJANDRA", "mu": "Santa Marta", "ci": "J6190", "ni": "10829025019", "ma": "156424", "em": "gerente.solucomtec@gmail.com", "te": "4309733", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ALAN ANDRES EHRHARDT ARRIETA", "mu": "El Banco", "ci": "G4755", "ni": "10077446940", "ma": "243389", "em": "alanehrhardtprivate@gmail.com", "te": "3148189425", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "TORRES PAREJO VICTOR ALONSO", "mu": "Santa Marta", "ci": "G4753", "ni": "10799130884", "ma": "244623", "em": "vfiera@hotmail.com", "te": "3147345794", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "POLO MARQUEZ YEINER DAMIAN", "mu": "Santa Marta", "ci": "H5320", "ni": "10830006421", "ma": "217933", "em": "jeinerpolo24@hotmail.com", "te": "3015282799", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MEATS COLOMBIA S.A.S.", "mu": "Santa Marta", "ci": "C1011", "ni": "9012088220", "ma": "206638", "em": "distribuidoraprimor.1@gmail.com", "te": "3118662747", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "PALACIO OSPINO DIDIER DANIEL", "mu": "Santa Marta", "ci": "G4773", "ni": "10830396792", "ma": "249664", "em": "didierpalacio7@gmail.com", "te": "3226214541", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "VEGA & POLO AGRICOLA S.A.S", "mu": "Zona Bananera", "ci": "A0161", "ni": "9015541043", "ma": "249994", "em": "onofrepolo@hotmail.com", "te": "3145911838", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "INGENIERIA N&P S.A.S.", "mu": "Santa Marta", "ci": "M7112", "ni": "9013541124", "ma": "224316", "em": "jorgejunior9111@hotmail.com", "te": "3016002975", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "BIOFRUTO S.A.", "mu": "Santa Marta", "ci": "A0111", "ni": "9001836474", "ma": "106808", "em": "santivivesp@hotmail.com", "te": "4210838", "to": "Sociedad Anonima", "es": "Matricula Activa"}, {"s": "DISTRIBUCIONES Y LOGISTICA GRANSURTIDOR S.A.S.", "mu": "Santa Marta", "ci": "G4631", "ni": "9004753742", "ma": "135322", "em": "info@distrilogist.com", "te": "4206815", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "SERVICIOS AMBIENTALES ESPECIALIZADOS S.A.S.", "mu": "Santa Marta", "ci": "E3900", "ni": "9010650283", "ma": "187041", "em": "direccionsaecaribesas@gmail.com", "te": "4395588", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "MAREQUIPOS S.A.S.", "mu": "Santa Marta", "ci": "A0122", "ni": "9007031247", "ma": "171670", "em": "marequipos@hotmail.com", "te": "4301627", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ULTRAPLAST SM S.A.S.", "mu": "Santa Marta", "ci": "C2013", "ni": "9015011766", "ma": "243946", "em": "esteban-aac21@hotmail.com", "te": "3143634076", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "KELVIN ANDRES BAYONA SOLANO", "mu": "Santa Marta", "ci": "I5611", "ni": "10957973936", "ma": "254628", "em": "Elephantburguerstm@gmail.com", "te": "3245726762", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MATERIALES Y TRITURADOS DEL NORTE S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "B0811", "ni": "9001642273", "ma": "105039", "em": "tritunorte@gmail.com", "te": "4361209", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "SOLUCING S.A.S.", "mu": "Santa Marta", "ci": "G4663", "ni": "9005799179", "ma": "146274", "em": "deividepoll3@gmail.com", "te": "3017774705", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "RUTAS Y TRANSPORTE S.A.S.", "mu": "Sabanas De San Angel", "ci": "H4921", "ni": "9016078910", "ma": "256969", "em": "rutrans2278@gmail.com", "te": "3173000020", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "COMPAÑIA IMPORT EXPORT DE COLOMBIA S.A.S.", "mu": "Santa Marta", "ci": "G4631", "ni": "9005735953", "ma": "145851", "em": "importexportgerencia@gmail.com", "te": "3205883548", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "EWS AQUA SOLUTIONS SAS EN LIQUIDACION JUDICIAL", "mu": "Santa Marta", "ci": "F4390", "ni": "9010358352", "ma": "183558", "em": "info@ewsaqua.co", "te": "3164501128", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ALEX ALFONSO PERTUZ DE LA CRUZ", "mu": "Zona Bananera", "ci": "I5621", "ni": "10474740020", "ma": "262259", "em": "alexpertuz94@gmail.com", "te": "3044814114", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "G&S ASESORES S.A.S.", "mu": "San Sebastian De Buenavista", "ci": "M7020", "ni": "9016619971", "ma": "263527", "em": "yuliandreagulloso@gmail.com", "te": "3025280895", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "CARLOS ANDRES SANCHEZ GONZALEZ", "mu": "Santa Marta", "ci": "F4111", "ni": "10655927471", "ma": "264616", "em": "carlossan6924@gmail.com", "te": "3007417877", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "EXPETRAVEL TOURS S.A.S.", "mu": "Santa Marta", "ci": "N7912", "ni": "9016742379", "ma": "264651", "em": "expetraveltours@gmail.com", "te": "3229255185", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "VMT PROYECTOS S.A.S.", "mu": "Santa Marta", "ci": "F4330", "ni": "9012169018", "ma": "207663", "em": "vmtproyectos@gmail.com", "te": "3148782308", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ALMACEN EL CONSTRUCTOR YEPES & ASOCIADOS S.A.S EN LIQUIDACION", "mu": "Plato", "ci": "G4663", "ni": "9006147290", "ma": "149695", "em": "almaconstructorsas@hotmail.com", "te": "4850281", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "DOTACIONES ORTOPEDICAS S.A.S.", "mu": "Fundacion", "ci": "G4645", "ni": "9016912972", "ma": "266203", "em": "dotacionesortopedicas@gmail.com", "te": "3235961797", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "AQUATIC EXPERIENCE YU&YOR S.A.S.", "mu": "Santa Marta", "ci": "N7912", "ni": "9016901733", "ma": "266232", "em": "yuliarmcom@gmail.com", "te": "3145402337", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "TURISMO CON ALTURA SAS", "mu": "Santa Marta", "ci": "N7912", "ni": "9015492374", "ma": "249545", "em": "turismoconaltura2023@gmail.com", "te": "3160504538", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "FLOREZ ZAMBRANO JACKELIN MARIA", "mu": "Santa Marta", "ci": "I5619", "ni": "497199547", "ma": "271259", "em": "salasgarciawilfrido@gmail.com", "te": "3004710339", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ALIANZA INTEGRAL DE SERVICIOS PROFESIONALES EN PROPIEDAD HORIZONTAL S.A.S.", "mu": "Santa Marta", "ci": "L6820", "ni": "9016935604", "ma": "266673", "em": "juanpbarriosoviedo@gmail.com", "te": "3106422921", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "TRANSPORTES MOVILIZANDO S.A.S.", "mu": "Santa Marta", "ci": "H4921", "ni": "9009189253", "ma": "189884", "em": "gerencia@transmovilizando.com", "te": "3112121909", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "GAVIRIA ESCOBAR GLADYS ALEJANDRA", "mu": "Santa Marta", "ci": "C1410", "ni": "10305397604", "ma": "127840", "em": "glagaes@hotmail.com", "te": "3014958011", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "CENTRO DE ENSEÑANZA AUTOMOVILÍSTICA ACADEMIA COLOMBIANA DEL CARIBE S.A.S.", "mu": "Santa Marta", "ci": "P8559", "ni": "9015745951", "ma": "252614", "em": "colombianadelcaribecea@gmail.com", "te": "3160504538", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "INGENIERÍA Y CONSTRUCCIÓN WPH S.A.S.", "mu": "Santa Marta", "ci": "F4390", "ni": "9016493167", "ma": "262359", "em": "ingenieriawphsas@gmail.com", "te": "3002964313", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "CONSTRU TRANSPORTE JIMENEZ S.A.S", "mu": "Santa Marta", "ci": "H4923", "ni": "9016496409", "ma": "262375", "em": "construtransportejimenez@gmail.com", "te": "3103656540", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "CONSTRUSOCIAL DOS S.A.S.", "mu": "Santa Marta", "ci": "F4290", "ni": "9003651110", "ma": "125309", "em": "construsocial2@yahoo.com", "te": "4225070", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "AUDIOVISUALES DEL CARIBE S.A.S", "mu": "Santa Marta", "ci": "J6311", "ni": "9015258309", "ma": "246869", "em": "caossantamarta@gmail.com", "te": "3102032605", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "BANDOLA SERVICE S.A.S", "mu": "Ariguaní", "ci": "I5621", "ni": "9014930526", "ma": "268189", "em": "bandolaservicesascompany.jc@gmail.com", "te": "3104353223", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "PILOTOS MARCARIBE S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "M7020", "ni": "8002210849", "ma": "32709", "em": "asistente@stmpilotos.com", "te": "3103631312", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "COMPAÑIA PROMOTORA DE TRANSPORTES BAGU S.A.S.", "mu": "San Sebastian De Buenavista", "ci": "H4921", "ni": "9012168201", "ma": "207674", "em": "transportesbagu240918@gmail.com", "te": "3225148394", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "TRUJILLO CLEVES CARLOS MARIO", "mu": "Ciénaga", "ci": "C2219", "ni": "10753004455", "ma": "272441", "em": "carlos.trujillo3@hotmail.com", "te": "3173259917", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "SERVIMAX - MOTOS OB S.A.S. EN LIQUIDACION", "mu": "San Sebastian De Buenavista", "ci": "G4541", "ni": "8190070336", "ma": "85002", "em": "lshernandez@orgvisal.com.co", "te": "3207927173", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "PUERTA GUTIERREZ JANNER ANDRES", "mu": "El Banco", "ci": "G4610", "ni": "12169648694", "ma": "187771", "em": "jaynerpuerta1993@gmail.com", "te": "3004328445", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "BANAPORT S.A.S.", "mu": "Santa Marta", "ci": "A0122", "ni": "9006919191", "ma": "157006", "em": "gerencia@banaport.com.co", "te": "4309346", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "GEH CONSTRUCCIONES S.A.S", "mu": "Santa Marta", "ci": "F4290", "ni": "9005816210", "ma": "146376", "em": "stewarbarros@hotmail.com", "te": "3122365883", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "PEDRO DIGNO NAVARRO CASTILLA", "mu": "Santa Marta", "ci": "F4112", "ni": "92706697", "ma": "140392", "em": "pedrod1607@yahoo.com", "te": "4316978", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "GIRALDO LOAIZA URIEL", "mu": "Santa Marta", "ci": "G4530", "ni": "159580623", "ma": "126547", "em": "josegiraldoloa@hotmail.com", "te": "3144397868", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "JCSN S.A.S.", "mu": "Santa Marta", "ci": "I5511", "ni": "9011136621", "ma": "193321", "em": "osorioyuliana246@gmail.com", "te": "3042219326", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "MULTISERCOM ML S.A.S.", "mu": "Santa Marta", "ci": "F4330", "ni": "9010531281", "ma": "185448", "em": "josehiguita79@gmail.com", "te": "3135493013", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "CHAMPAN MINERALS S.A.S EN LIQUIDACION", "mu": "Santa Marta", "ci": "B0811", "ni": "9009442826", "ma": "175448", "em": "champanminerals@gmail.com", "te": "3148745330", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "NEPESA S.A.S.", "mu": "Santa Marta", "ci": "F4210", "ni": "9009986521", "ma": "180278", "em": "pedrod1607@yahoo.com", "te": "3137580237", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "MARCA INMOBILIARIA S.A.S EN LIQUIDACION", "mu": "Santa Marta", "ci": "L6810", "ni": "9009298600", "ma": "174239", "em": "gerencia@marcainmobiliaria.co", "te": "3164338309", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "INVERSIONES HOSTALES DE COLOMBIA S.A.S.", "mu": "Santa Marta", "ci": "I5519", "ni": "9012196705", "ma": "208115", "em": "alvaro.castano@pwsas.com.co", "te": "3134031125", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "DOTACIONES CLINICAS CR S.A.S", "mu": "Fundacion", "ci": "G4645", "ni": "9013961400", "ma": "230945", "em": "dotacionesclinica@gmail.com", "te": "3006107208", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "BIOMAX CLEAN COMPANY S.A.S", "mu": "Santa Marta", "ci": "G4620", "ni": "9014963183", "ma": "242854", "em": "ingjesusrua@gmail.com", "te": "3004647022", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ESPERANZA GROUP S.A.S. EN LIQUIDACION", "mu": "Santa Marta", "ci": "A0122", "ni": "9012046573", "ma": "206049", "em": "krodriguez@esperanzagroup.co", "te": "3014889564", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "LA BAVIERA ECO-SOLUTIONS S.A.S.", "mu": "Fundacion", "ci": "G4631", "ni": "9017026509", "ma": "267779", "em": "fincabaviera@gmail.com", "te": "3225480977", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "INVERSIONES PLAYA LA ROCA S.A.S.", "mu": "Santa Marta", "ci": "I5511", "ni": "9005559208", "ma": "143880", "em": "playalarocaecohotel@gmail.com", "te": "3162667798", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "RIOMAG SERVICES SAS", "mu": "Tenerife", "ci": "I5629", "ni": "9014715475", "ma": "240573", "em": "ximismaria14@hotmail.com", "te": "3128751018", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "TRANSPASS S.A.S.", "mu": "Santa Marta", "ci": "H4921", "ni": "9017049075", "ma": "269615", "em": "transpass@gmail.com", "te": "3186899881", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "COINTERV S.A.S.", "mu": "Santa Marta", "ci": "M7111", "ni": "9013959759", "ma": "230946", "em": "jedaguar@gmail.com", "te": "3023069265", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ARV SOLUTION S.A.S.", "mu": "Santa Marta", "ci": "F4390", "ni": "9012966853", "ma": "218017", "em": "arq.jorgearquez@yahoo.com", "te": "3205193467", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "PALQUIS S.A.S. EN LIQUIDACION", "mu": "Aracataca", "ci": "A0161", "ni": "9004464351", "ma": "132739", "em": "palquis.sas406@gmail.com", "te": "3145150725", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "DEVANS ORTIZ ALDAIR LEONARDO", "mu": "Santa Marta", "ci": "I5619", "ni": "10829864880", "ma": "268185", "em": "ortizleonardo1994@gmail.com", "te": "3025499568", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "HERNANDEZ MUÑOZ YILA JOSE", "mu": "Plato", "ci": "G4771", "ni": "10482153409", "ma": "268224", "em": "yilajo@hotmail.com", "te": "3136116106", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "CAMILO ANDRES CASTILLO HERNANDEZ", "mu": "Santa Marta", "ci": "G4773", "ni": "10018565783", "ma": "245003", "em": "camilo.castilloh07@gmail.com", "te": "4371332", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "SEGURIDAD DIESEL S.A.S.", "mu": "Santa Marta", "ci": "G4530", "ni": "9007551289", "ma": "156703", "em": "ehtpersonal@gmail.com", "te": "3013910891", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "BAUTISTA BETANCUR ERICA PAOLA", "mu": "Santa Marta", "ci": "G4723", "ni": "10829536900", "ma": "221328", "em": "ericabautista_2013@hotmail.com", "te": "3108425488", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "GARCIA ROJAS SARA MELISA", "mu": "Santa Marta", "ci": "I5519", "ni": "10136492190", "ma": "268256", "em": "sarita_9310@hotmail.com", "te": "3022858291", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "RIBON BERRIO JORGE ALONSO", "mu": "Plato", "ci": "G4754", "ni": "125907982", "ma": "176650", "em": "cballestasospino97@gmail.com", "te": "3003994426", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "JOHN JAIRO BARRIOS CANTILLO", "mu": "Santa Marta", "ci": "E3830", "ni": "722688206", "ma": "251481", "em": "yajab2888@gmail.com", "te": "3166409138", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "FIGUEROA RAMIREZ MARTIN EMILIO", "mu": "Santa Marta", "ci": "G4711", "ni": "10986069771", "ma": "191843", "em": "martinsata_06@hotmail.com", "te": "3043682127", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "OSPINO GARCIA MILENA JHOVANA", "mu": "Santa Marta", "ci": "I5630", "ni": "367274280", "ma": "268308", "em": "milenajhovanaospinogarcia@gmail.com", "te": "3166864367", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "COGOLLO MARIN DANIELA SOFIA", "mu": "Santa Marta", "ci": "G4759", "ni": "10077659139", "ma": "268382", "em": "dscm12@gmail.com", "te": "3103920174", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "SERVICIOS Y ASESORIAS DEL MAGDALENA S.A.S", "mu": "Aracataca", "ci": "J6190", "ni": "9007830258", "ma": "164348", "em": "rafaelcapdevilla23@gmail.com", "te": "4309733", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "AUDIGRAL S.A.S.", "mu": "Santa Marta", "ci": "M7020", "ni": "9006264868", "ma": "151118", "em": "audigral@gmail.com", "te": "4350960", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "MARTHA SILVANA DELGADO PAMPLONA", "mu": "Fundacion", "ci": "G4520", "ni": "523592309", "ma": "260279", "em": "kminyectronic07@hotmail.com", "te": "3186799659", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "DE LUQUE GARCIA OSIRIS ANTONIO", "mu": "Santa Marta", "ci": "N8219", "ni": "854495474", "ma": "53421", "em": "juandeluque10@hotmail.com", "te": "4234792", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "PEREIRA CAÑAS DEIBIS JOSE", "mu": "Santa Marta", "ci": "G4723", "ni": "10830070510", "ma": "268509", "em": "elisavilanoriega@gmail.com", "te": "3007387131", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MULTISERVICIOS J.S.B. S.A.S.", "mu": "Aracataca", "ci": "A0161", "ni": "9012109621", "ma": "206829", "em": "dapabalo-026@hotmail.com", "te": "3003377854", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "PAYFAR S.A.S.", "mu": "El Piñon", "ci": "G4645", "ni": "9015046452", "ma": "273087", "em": "dpayfar@gmail.com", "te": "3135464169", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ESPINOSA MORALES PATRICIA MARGARITA", "mu": "Santa Marta", "ci": "M6920", "ni": "572921480", "ma": "268507", "em": "patriciaespinosamorales@hotmail.com", "te": "3188280729", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "AMSA CREATIVOS  S.A.S.", "mu": "Santa Marta", "ci": "M7310", "ni": "9017099291", "ma": "268486", "em": "joseinaciotoro@gmail.com", "te": "3013645647", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "TEOLINDA CEBALLOS AROCA", "mu": "Algarrobo", "ci": "G4711", "ni": "365936985", "ma": "253859", "em": "merybeltran780@gmail.com", "te": "3012118584", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MANJARRES CARO LEISMAN JUNIOR", "mu": "Santa Marta", "ci": "R9007", "ni": "10830307592", "ma": "268459", "em": "tiendasevendecol@gmail.com", "te": "3107440193", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "YASMERYS CRUZ RODRIGUEZ NOGUERA", "mu": "Santa Marta", "ci": "G4719", "ni": "10828540511", "ma": "254664", "em": "yasmerodriguez@gmail.com", "te": "3005940296", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MAIGUEL EBRAT CIRO ENRIQUE", "mu": "Santa Marta", "ci": "G4759", "ni": "125596558", "ma": "268543", "em": "elsaco0624@hotmail.com", "te": "3124046706", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MARQUEZ GARCIA NIXON ANDRES", "mu": "Santa Marta", "ci": "G4711", "ni": "10043603613", "ma": "268549", "em": "jennymarquezgarcia1292@gmail.com", "te": "3022326944", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "TONCEL POLO JOHANA MARCELA", "mu": "Ciénaga", "ci": "R9200", "ni": "12219695859", "ma": "249855", "em": "jtoncelpolo@gmail.com", "te": "3008435025", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "GUERRERO ALVEAR JANNETH", "mu": "El Banco", "ci": "M7310", "ni": "390143133", "ma": "239736", "em": "jannethalvear0119@gmail.com", "te": "3022143740", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "VIZCAINO CALERO MALORY JOHANA", "mu": "Santa Marta", "ci": "S9602", "ni": "10830268936", "ma": "268608", "em": "maloryyluis08@gmail.com", "te": "3243824220", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "AGROMINERALES M.G. S.A.S.", "mu": "Santa Marta", "ci": "G4631", "ni": "9011542591", "ma": "198662", "em": "agrominmg@hotmail.com", "te": "3203825957", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "MISTER ASEO Y MAS S.A.S.", "mu": "Santa Marta", "ci": "G4759", "ni": "9015603741", "ma": "250883", "em": "misteraseoymas@gmail.com", "te": "3004696136", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ADR ARQUITECTOS S.A.S EN LIQUIDACION", "mu": "Santa Marta", "ci": "F4111", "ni": "9007658597", "ma": "163077", "em": "fe.adrarquitectos@gmail.com", "te": "4310024", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "RODRIGUEZ SAUMETH ALVARO MIGUEL", "mu": "Santa Marta", "ci": "G4620", "ni": "10830120384", "ma": "268671", "em": "ervicioslegalesars@gmail.com", "te": "3007399216", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "GUARIN PARDO OSCAR EMILIO", "mu": "El Banco", "ci": "C3110", "ni": "10850943290", "ma": "195286", "em": "ciguape@hotmail.com", "te": "3116577398", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MERCADO PEREZ FREDYS RAFAEL", "mu": "Santa Marta", "ci": "G4724", "ni": "195201410", "ma": "158372", "em": "gladismar_20@hotmail.com", "te": "4208793", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "INTEGRAL LIMITADA", "mu": "Santa Marta", "ci": "J6201", "ni": "8305007258", "ma": "156625", "em": "info@integral.net.co", "te": "4200166", "to": "Sociedad Limitada", "es": "Matricula Activa"}, {"s": "CONSCIENCIA CONSCIENTE S.A.S.", "mu": "Santa Marta", "ci": "G4773", "ni": "9013029388", "ma": "218742", "em": "conscienciaconscientesas@gmail.com", "te": "3205726514", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "'COLPERITOS COLOMBIA S.A.S.'", "mu": "Santa Marta", "ci": "M6910", "ni": "9014253473", "ma": "234642", "em": "colperitos.colombia@gmail.com", "te": "3005681902", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "R&M SERVICIOS Y SOLUCIONES INTEGRALES S.A.S.", "mu": "Santa Marta", "ci": "I5511", "ni": "9017119794", "ma": "268718", "em": "materialesysuministros273@gmail.com", "te": "3133403411", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "LINA MARCELA DIAZ GONZALEZ", "mu": "Santa Marta", "ci": "G4774", "ni": "10829096327", "ma": "252720", "em": "linadiaz_2505@hotmail.com", "te": "3012318148", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "HERRERA GOMEZ SANDRA MILENA", "mu": "Santa Marta", "ci": "G4755", "ni": "225860259", "ma": "220125", "em": "samiherrera03311983@gmail.com", "te": "3135780304", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "SUAREZ MEJIA YAMITH ANTONIO", "mu": "Santa Ana", "ci": "G4711", "ni": "920998851", "ma": "268805", "em": "beatrizegomezsoto@gmail.com", "te": "3135042727", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "COMERCIALIZADORA GASTRONOMICA DEL NORTE S.A.S", "mu": "Santa Marta", "ci": "G4631", "ni": "9014307706", "ma": "235282", "em": "daviddecortez@gmail.com", "te": "3008562258", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "VALDEBLANQUEZ PAEZ ZHARICK MILED", "mu": "Santa Marta", "ci": "R9200", "ni": "10828672995", "ma": "268767", "em": "zharickmiled15@gmail.com", "te": "3205927508", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "PAULA ANDREA ECHEVERRI PLATA", "mu": "Santa Marta", "ci": "I5611", "ni": "10828559858", "ma": "261200", "em": "paulaecheverri247@gmail.com", "te": "3015390082", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "SOLUCIONES EN MANTENIMIENTO INDUSTRIAL Y METALMECANICO S.A.S.", "mu": "Santa Marta", "ci": "C3312", "ni": "9005937719", "ma": "147545", "em": "cmendez@smim.com.co", "te": "4354863", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "OROZCO REALES YAIR JOSE", "mu": "Santa Marta", "ci": "S9602", "ni": "854608165", "ma": "227558", "em": "yoreales@hotmail.com", "te": "3164830686", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ORLY JOSE MARTINEZ AHUMADA", "mu": "Ciénaga", "ci": "S9522", "ni": "853702342", "ma": "252508", "em": "orlyjosejosemartinezahumada@gmail.com", "te": "3008434998", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "PRONTOENVIO LTDA. EN LIQUIDACION", "mu": "Santa Marta", "ci": "H5320", "ni": "8190067084", "ma": "82113", "em": "antoniobrito18@msn.com", "te": "3014155044", "to": "Sociedad Limitada", "es": "Matricula Activa"}, {"s": "GOMEZ VARGAS VICTOR HUGO", "mu": "Santa Marta", "ci": "G4723", "ni": "11033643929", "ma": "268838", "em": "vicgomez2788@gmail.com", "te": "3009794610", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ARITEL TELECOMUNICACIONES S.A.S.", "mu": "Ariguaní", "ci": "J6110", "ni": "9013839567", "ma": "228183", "em": "aritelsas@gmail.com", "te": "3117715453", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "TRANSPORTES CANVA S.A.S.", "mu": "Santa Marta", "ci": "H4921", "ni": "9013228686", "ma": "221033", "em": "transportecanva@gmail.com", "te": "3008861344", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "CHARRIS LOPEZ YESENIA ISABEL", "mu": "Algarrobo", "ci": "R9329", "ni": "367247441", "ma": "268904", "em": "yeseniacharris@gmail.com", "te": "3126150218", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "GALAGAR CIGARS SAS", "mu": "Santa Marta", "ci": "G4711", "ni": "9017140422", "ma": "268923", "em": "assistant@groupconsultores.com", "te": "3215962906", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "FACTINSUMOS S.A.S", "mu": "Santa Marta", "ci": "G4645", "ni": "9016384469", "ma": "261096", "em": "factinsumos26@gmail.com", "te": "3158944317", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "PEREZ RUIZ INGRID ESTEFANY", "mu": "Santa Marta", "ci": "I5519", "ni": "10008367472", "ma": "269035", "em": "perezestefany454@gmail.com", "te": "3128142170", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "LUZ ALBENIS CANTILLO MORELO", "mu": "Zona Bananera", "ci": "G4711", "ni": "527500861", "ma": "249906", "em": "luzcantillomorelo@gmail.com", "te": "3133604748", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ROLON CUELLO KEILA ANDREA", "mu": "Santa Marta", "ci": "C1081", "ni": "10830326579", "ma": "269015", "em": "aldhanacastrop@gmail.com", "te": "3042197768", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ESTHER MARIA CHOPERENA TORRES", "mu": "Ariguaní", "ci": "S9609", "ni": "390722759", "ma": "252863", "em": "estherchoperenatorres@gmail.com", "te": "3012237002", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "BUFET DE ABOGADOS ROBERTO CORREA S.A.S", "mu": "Santa Marta", "ci": "M6910", "ni": "9011336933", "ma": "196142", "em": "robertocivilp@gmail.com", "te": "3017077147", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "DE LA HOZ SANDOVAL JOSE DANIEL", "mu": "Santa Marta", "ci": "H4923", "ni": "10072361094", "ma": "269041", "em": "transporte.caribehs@gmail.com", "te": "3244085435", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "JORGE MARIO TOLOZA ARANGO", "mu": "El Banco", "ci": "G4711", "ni": "10244667543", "ma": "261396", "em": "tolozaarangojorgemario@gmail.com", "te": "3108487636", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ROCIO DEL PILAR VIZCAYA", "mu": "Fundacion", "ci": "I5619", "ni": "574462815", "ma": "253947", "em": "vizcayarocio71@gmail.com", "te": "3214231701", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "POLO OBISPO MIGUEL ANGEL", "mu": "Ciénaga", "ci": "I5611", "ni": "126263195", "ma": "269065", "em": "durantulia8@gmail.com", "te": "3012579417", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "PAREJO MILCIADES ENRIQUE", "mu": "Santa Marta", "ci": "S9602", "ni": "76027236", "ma": "269101", "em": "milciadesparejo@gmail.com", "te": "3012259745", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "EVER ALCIDES GONZALEZ QUINTANA", "mu": "Santa Marta", "ci": "S9521", "ni": "20000003662", "ma": "259391", "em": "alcidezz834@gmail.com", "te": "3012553681", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "COLOMBIA INTEGRAL SERVICES S.A.S.", "mu": "Santa Marta", "ci": "N8121", "ni": "9012825198", "ma": "216294", "em": "col.integralservice@gmail.com", "te": "3122861258", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ALVAREZ GUTIERREZ ALFONSO JOSE", "mu": "Santa Marta", "ci": "I5630", "ni": "10829851416", "ma": "178659", "em": "alfonso_2994@hotmail.com", "te": "3218280064", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "CUDRIZ ROMO JULIANA ESTHER", "mu": "Santa Marta", "ci": "J6201", "ni": "10828634361", "ma": "208527", "em": "info@arpanet.com.co", "te": "3152512540", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "RIOS AGUILAR MARIA DEL CARMEN", "mu": "Santa Marta", "ci": "G4782", "ni": "10044615770", "ma": "269166", "em": "maryaguilar0526@gmail.com", "te": "3146942141", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ABRAHAN NICOL ROMERO CASTILLO", "mu": "Santa Marta", "ci": "G4711", "ni": "10043695271", "ma": "245854", "em": "abrahamromerocastillo1@gmail.com", "te": "3043183696", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "GUZMAN SANTANDER JHON DAVID", "mu": "Santa Marta", "ci": "G4741", "ni": "11408330559", "ma": "269170", "em": "jhonguzman098@gmail.com", "te": "3042675354", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "NIÑO TABORDA JOHANNA", "mu": "Santa Marta", "ci": "G4729", "ni": "572921751", "ma": "269173", "em": "ninojohana75@gmail.com", "te": "3222428351", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "OCEAN PARADICE CLUB  S.A.S.", "mu": "Santa Marta", "ci": "H5011", "ni": "9017171090", "ma": "269228", "em": "contacto@peopleconsultores.com", "te": "3022214176", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "CADENA VESGA JOSE LUIS", "mu": "Santa Marta", "ci": "I5519", "ni": "911025490", "ma": "74179", "em": "josecadena_1@hotmail.com", "te": "3184664549", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "HOTEL SANTA MARTA J&L S.A.S.", "mu": "Santa Marta", "ci": "I5511", "ni": "9014721248", "ma": "240551", "em": "jylempresas@gmail.com", "te": "3233638959", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "DAZA PINEDO LUIS MIGUEL", "mu": "Santa Marta", "ci": "I5611", "ni": "125629926", "ma": "208976", "em": "quedatcallaogourmet@gmail.com", "te": "3006780601", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ROA MARTINEZ BISBET ALBERTO", "mu": "Santa Marta", "ci": "N8129", "ni": "771718180", "ma": "269284", "em": "bisbetroa@hotmail.com", "te": "3148695683", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MESTRE PALMA CARMEN LILIANA", "mu": "Santa Marta", "ci": "G4771", "ni": "10830247985", "ma": "181190", "em": "karmenfit18@gmail.com", "te": "3015517357", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "SERPA IGLESIAS RAFAELA DEL SOCORRO", "mu": "Ariguaní", "ci": "I5611", "ni": "326658733", "ma": "241187", "em": "kmargarita_p30@hotmail.com", "te": "3107205724", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "DE LA HOZ GUTIERREZ YOVANI RAFAEL", "mu": "Santa Marta", "ci": "N7729", "ni": "10830268570", "ma": "269286", "em": "delahozyovani970@gmail.com", "te": "3135983254", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "GARZON REY MATEO", "mu": "Santa Marta", "ci": "G4754", "ni": "173376317", "ma": "269321", "em": "julio.mateo.garzon@gmail.com", "te": "3103258750", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "GARCERANT JIMENEZ ISAAC DAVID", "mu": "Santa Marta", "ci": "C2511", "ni": "10828874016", "ma": "231424", "em": "isaacgarji@hotmail.com", "te": "3153304758", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ACOSTA DOMINGUEZ LUIS EDUARDO", "mu": "Santa Marta", "ci": "F4321", "ni": "787597389", "ma": "188887", "em": "luisedoacosta@hotmail.com", "te": "4235062", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "PROYECTOS Y GESTION EMPRESARIAL SAS", "mu": "Santa Marta", "ci": "M7490", "ni": "9001661457", "ma": "105188", "em": "progestsas2023@gmail.com", "te": "3024209855", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "LOPEZ MARTINEZ DANIELA ELVIRA", "mu": "Santa Marta", "ci": "G4782", "ni": "11213311743", "ma": "269388", "em": "danielalopezmar20@gmail.com", "te": "3148241708", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MENDEZ VALERA LIZETH MAYARITH", "mu": "Santa Marta", "ci": "S9602", "ni": "10829498238", "ma": "269397", "em": "lizmenval@hotmail.com", "te": "3167080494", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "CHIOS HOSTAL S.A.S", "mu": "Santa Marta", "ci": "I5519", "ni": "9016279226", "ma": "259766", "em": "hostaleschio@gmail.com", "te": "3194302096", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "BLANCO FONSECA ANA ISABEL", "mu": "Ariguaní", "ci": "G4719", "ni": "366234427", "ma": "190821", "em": "blancofonsecaanaisabel@gmail.com", "te": "3022677196", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MARTINEZ REYES MARIA ALEXANDRA", "mu": "Santa Marta", "ci": "G4719", "ni": "519733495", "ma": "269468", "em": "fundason@hotmail.com", "te": "3163597850", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "HONORIA GALICIA PIÑA", "mu": "Santa Marta", "ci": "G4799", "ni": "7003391423", "ma": "259841", "em": "honoriagaliciap@gmail.com", "te": "3125557383", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MENDOZA MOSQUERA ALIRIO", "mu": "Santa Marta", "ci": "G4711", "ni": "914733700", "ma": "127891", "em": "aliriom087@gmail.com", "te": "3005911522", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ANGELA UBALDINA PAREDES LANCACHO", "mu": "Santa Marta", "ci": "G4724", "ni": "682952246", "ma": "255068", "em": "ubaldinalancacho@gmail.com", "te": "3007464072", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "E.M.G. MARKETING SAS", "mu": "Santa Marta", "ci": "M7310", "ni": "9017190038", "ma": "269469", "em": "emg.marketing.col@gmail.com", "te": "3153696526", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "OLIVEROS CENTENO YENIS ESTHER", "mu": "Santa Marta", "ci": "C1104", "ni": "365620080", "ma": "269431", "em": "yenisoliveros2018@gmail.com", "te": "3104746288", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ACACIAS CONSTRUCCIONES S.A.S.", "mu": "Santa Marta", "ci": "F4290", "ni": "9012792938", "ma": "215912", "em": "urbanizacionlasacacias@gmail.com", "te": "4407127", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "BETTIN RODRIGUEZ SANDRA MILENA", "mu": "Santa Marta", "ci": "G4719", "ni": "12364395201", "ma": "269445", "em": "eldariog012@gmail.com", "te": "3015827430", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "SERGIO ALONSO FAJARDO TOSCANO", "mu": "Santa Marta", "ci": "M7310", "ni": "11432439988", "ma": "259927", "em": "sergiof1720@gmail.com", "te": "3233207287", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "BARON RODRIGUEZ DORIS", "mu": "Santa Marta", "ci": "C1410", "ni": "365551904", "ma": "177870", "em": "dbarod@hotmail.com", "te": "3106321405", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "TRANSPORTES TENDENCIAS DEL CARIBE S.A.S.", "mu": "Santa Marta", "ci": "H4921", "ni": "9006619511", "ma": "154460", "em": "tytendencias@hotmail.com", "te": "3148204733", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "RAMIREZ NORIEGA REBECA CAROLINA", "mu": "Santa Marta", "ci": "C1410", "ni": "390044218", "ma": "193797", "em": "rcrn_10@hotmail.com", "te": "3799973", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "GOMEZ NAVARRO ALVARO", "mu": "Santa Marta", "ci": "G4711", "ni": "910432177", "ma": "226944", "em": "alvarogomeznavarro72@gmail.com", "te": "3115938033", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ARIZA RODRIGUEZ MARIO ANDRES", "mu": "Santa Marta", "ci": "I5630", "ni": "10043456307", "ma": "269542", "em": "mario.ariza80@hotmail.com", "te": "3137855936", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "SANCHEZ SUAREZ ORLANDO", "mu": "Zona Bananera", "ci": "G4721", "ni": "910406230", "ma": "128548", "em": "alsae26@hotmail.com", "te": "3163835254", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "PEREZ CORONADO ALEJANDRO", "mu": "Zona Bananera", "ci": "I5630", "ni": "853806411", "ma": "269537", "em": "perezcoronadoalejandro2023@gmail.com", "te": "3225527365", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "RINCON TECNO COLOMBIA S.A.S.", "mu": "Santa Marta", "ci": "G4741", "ni": "9014999638", "ma": "243640", "em": "rincontecnocolombia@gmail.com", "te": "3104093857", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "SOLANO PUELLO FABIO ANDRES", "mu": "Santa Marta", "ci": "G4723", "ni": "11212965610", "ma": "228103", "em": "dinapuello@hotmail.com", "te": "3158059166", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "CONSTRUIR SOLUCIONES DE INGENIERIA S.A.S", "mu": "Santa Marta", "ci": "F4210", "ni": "9000416959", "ma": "91887", "em": "construirsolucionesdeingenieria@hotmail.com", "te": "3172900125", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "SANTANA BERRIO RAFAEL ANTONIO", "mu": "Santa Marta", "ci": "N7730", "ni": "125477482", "ma": "165949", "em": "rafaelsantana0018@gmail.com", "te": "3008460063", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "GARCIA ZIRENE RONALDO MAURICIO", "mu": "Santa Marta", "ci": "M7420", "ni": "10043471907", "ma": "269627", "em": "rzirenexe@gmail.com", "te": "3215941895", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "KAREN DANIELA BODHERT JIMENEZ", "mu": "Santa Marta", "ci": "C1410", "ni": "10076929768", "ma": "262480", "em": "bodhertkaren@gmail.com", "te": "3015475943", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "TOPOGRAFIA E INGENIERIA S.A.S.", "mu": "Santa Marta", "ci": "M7112", "ni": "9010689069", "ma": "187500", "em": "topografiaingenieriarvvz@gmail.com", "te": "3017277050", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ORDOÑEZ BELTRAN LUIS EDUARDO", "mu": "Santa Marta", "ci": "I5511", "ni": "11188048701", "ma": "220640", "em": "tayronacampingcastilletes@gmail.com", "te": "3233638959", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ANDUEZA ACUÑA JACKELINE ESTHER", "mu": "Plato", "ci": "G4620", "ni": "328719132", "ma": "269669", "em": "kevin-16082@hotmail.com", "te": "3045353120", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "AL AIRE LIBRE TRAVEL S.A.S.", "mu": "Santa Marta", "ci": "N7911", "ni": "9017208597", "ma": "269656", "em": "laura16co@hotmail.com", "te": "3232346027", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "INVERSIONES LA GRAN PRIMAVERA S.A.S.", "mu": "Santa Marta", "ci": "L6810", "ni": "9016422056", "ma": "261470", "em": "beatrizc@grupoarcas.com", "te": "3187387924", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "DISTRIBUCIONES A & T S.A.S.", "mu": "Santa Marta", "ci": "G4669", "ni": "9004489249", "ma": "132955", "em": "contabilidad@distribucionesayt.com", "te": "4358134", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ALENT ENRIQUE TRUJILLO ESMERAL", "mu": "Santa Marta", "ci": "I5611", "ni": "723435155", "ma": "255768", "em": "alentrujillo84@gmail.com", "te": "3154007202", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "H Y D ROGER BARCAS S.A.S.", "mu": "Santa Marta", "ci": "G4520", "ni": "9009561117", "ma": "176530", "em": "roge.rb123@hotmail.com", "te": "4376314", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "CESAR DAVID ANAYA MEZA", "mu": "Nueva Granada", "ci": "H5310", "ni": "11927172913", "ma": "254517", "em": "anayacesar925@gmail.com", "te": "3215535138", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "PALLARES ROJAS CRISTINA SARAY", "mu": "Santa Marta", "ci": "M7410", "ni": "10025018527", "ma": "269724", "em": "cristinapallares98@gmail.com", "te": "3246320828", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ECOMAR TUCURINCA S.A.S", "mu": "Zona Bananera", "ci": "A0161", "ni": "9012097431", "ma": "206751", "em": "ezequielpaquer@gmail.com", "te": "3147878376", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "AGROAMERICANA DEL CARIBE S.A.S.", "mu": "Santa Marta", "ci": "G4620", "ni": "9017212507", "ma": "269683", "em": "agroamericanadelcaribesas@gmail.com", "te": "3024371019", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "AGROINSUMOS SM S.A.S", "mu": "Santa Marta", "ci": "G4620", "ni": "9017226314", "ma": "269748", "em": "agroinsumosas.sm@gmail.com", "te": "3145369796", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "TRUJILLO VARGAS ADRIAN JOSE", "mu": "Santa Marta", "ci": "G4711", "ni": "10830405005", "ma": "269772", "em": "karen1992sep@gmail.com", "te": "3011242900", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "GUERRERO CANO DANEYDIS VANESSA", "mu": "Santa Marta", "ci": "G4719", "ni": "10472395831", "ma": "269760", "em": "dannaguerrero458@gmail.com", "te": "3015974233", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MAESTRE HERRERA GINA PAOLA", "mu": "Santa Marta", "ci": "F4290", "ni": "10828820866", "ma": "269765", "em": "samanthamaestreherrera@gmail.com", "te": "3001519661", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "BENJUMEA FRAGOZO LEUDY IRINA", "mu": "Santa Marta", "ci": "S9602", "ni": "10828810560", "ma": "269822", "em": "leubeestetica@gmail.com", "te": "3016133051", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "FONSECA SANTANDER GABRIEL OMAR", "mu": "Santa Marta", "ci": "N8219", "ni": "10798846587", "ma": "269842", "em": "ing.gabriel.fonseca@gmail.com", "te": "3006294460", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "CLETO RAFAEL MORILLO SANTOS", "mu": "Santa Marta", "ci": "A0161", "ni": "68204811", "ma": "225914", "em": "cletomorillo@hotmail.com", "te": "3107142369", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "JORGE ELIECER DIAZ CUELLO", "mu": "Santa Marta", "ci": "H4923", "ni": "854567788", "ma": "255635", "em": "diazcuellojorgeeliecer@gmail.com", "te": "3042159380", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MINING -&- BLASTING INGENIERIA EN PERFORACION Y VOLADURAS S.A.S.", "mu": "Santa Marta", "ci": "M7112", "ni": "9015593311", "ma": "250730", "em": "gmexplosivos@gmail.com", "te": "3182242534", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "'COTES MAESTRE Y CIA S. EN C. S.'", "mu": "Santa Marta", "ci": "G4772", "ni": "9014406123", "ma": "236501", "em": "carloscotes1202@hotmail.com", "te": "3004451300", "to": "Sociedad de Comandita Simple", "es": "Matricula Activa"}, {"s": "OVIEDO MOLINA MERLY PAOLA", "mu": "Santa Marta", "ci": "G4711", "ni": "10828983133", "ma": "249568", "em": "holmansmith2006@gmail.com", "te": "3014862568", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "SIERRA MEJIA JHON ALEXANDER", "mu": "Santa Marta", "ci": "G4799", "ni": "11117580126", "ma": "269875", "em": "mlix67038@gmail.com", "te": "3218167523", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "RODRIGUEZ JIMENEZ KAREN YELITZA", "mu": "El Banco", "ci": "C1410", "ni": "552259530", "ma": "269879", "em": "karenbordados03@gmail.com", "te": "3107094955", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "SERVING PROFESSIONALS S.A.S.", "mu": "Santa Marta", "ci": "F4321", "ni": "9011941919", "ma": "204810", "em": "wilfordelias@hotmail.com", "te": "3002886765", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "MARTINEZ BUILES CARLOS ALBERTO", "mu": "Fundacion", "ci": "G4711", "ni": "80148091", "ma": "216985", "em": "builesc82@gmail.com", "te": "3008475153", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "DUQUE ORTIZ CESAR WILLIAM", "mu": "Santa Marta", "ci": "I5519", "ni": "793637295", "ma": "269954", "em": "cwdorsoporte@gmail.com", "te": "3046772639", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "AG 2000 S.A.S.", "mu": "Santa Marta", "ci": "A0161", "ni": "9004072554", "ma": "128668", "em": "ag2000.sas500@gmail.com", "te": "4212445", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "SERVICIOS DE CARGA Y TRANSPORTES VELOZ S.A.S.", "mu": "Santa Marta", "ci": "H4923", "ni": "9013220064", "ma": "220973", "em": "serviveloz.sas@gmail.com", "te": "3234660655", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "BELTRAN ZARAS IZAEL ENRIQUE", "mu": "Aracataca", "ci": "C1089", "ni": "10044852581", "ma": "258226", "em": "izaelb392@gmail.com", "te": "3136933958", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ROJAS FLOREZ BRAYAN ESMITH", "mu": "Santa Marta", "ci": "G4520", "ni": "10043657871", "ma": "269996", "em": "villeroangie13@gmail.com", "te": "3014682812", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "BARRIOS REDONDO DIEGO ARMANDO", "mu": "Santa Marta", "ci": "G4752", "ni": "10829605388", "ma": "270006", "em": "dcconstrucciones33@gmail.com", "te": "3218427300", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "FONTALVO FLOREZ KLIVER", "mu": "Ciénaga", "ci": "G4724", "ni": "10834520295", "ma": "270004", "em": "kliver99fontalvo@gmail.com", "te": "3227259825", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ZABLEH OROZCO BICHARA JOSE", "mu": "Santa Marta", "ci": "G4752", "ni": "10828885169", "ma": "211472", "em": "bicharazablehorozco@gmail.com", "te": "4353209", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "GOMEZ BARRETO LUIS ANGEL", "mu": "Santa Marta", "ci": "S9609", "ni": "10020300164", "ma": "270014", "em": "riquelmerangel2016@gmail.com", "te": "3145301325", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "CAMARGO MENDOZA JAVIER JOSE", "mu": "Santa Marta", "ci": "G4773", "ni": "10829197399", "ma": "166956", "em": "javierc2506@gmail.com", "te": "3046079312", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "VERGARA ARENA ALEXANDRA TATIANA", "mu": "Santa Marta", "ci": "G4774", "ni": "10073985170", "ma": "270064", "em": "alexvergara017@gmail.com", "te": "3052015598", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ANAYA ANDRADE FRANCISCO JOSE", "mu": "Chibolo", "ci": "G4711", "ni": "10040920561", "ma": "206945", "em": "francisco.anaya2014@hotmail.com", "te": "3012211608", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "FUENTES MENDOZA DANIS ENRIQUE", "mu": "Zona Bananera", "ci": "G4663", "ni": "11935427391", "ma": "270101", "em": "danifm2993@hotmail.com", "te": "3013879284", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "LUBRITRANSPORTES SAS", "mu": "Santa Marta", "ci": "H4923", "ni": "9017270056", "ma": "270178", "em": "geh@hotmail.es", "te": "3122365883", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "KATHIA ALEXANDRA ORTIZ CANTILLO", "mu": "El Piñon", "ci": "A0126", "ni": "268131881", "ma": "258155", "em": "koritza72@me.com", "te": "2104224537", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "PITA CRESPO MELISSA FERNANDA", "mu": "Santa Marta", "ci": "M7020", "ni": "10829426673", "ma": "270175", "em": "estratega.smartmarketing@gmail.com", "te": "3053143973", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ROBLES CORDERO KELLY JOHANA", "mu": "El Banco", "ci": "G4752", "ni": "390222730", "ma": "194549", "em": "jhonis_africano79@hotmail.com", "te": "3135145032", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "DUQUE RIVERA LAURA DANIELA", "mu": "Santa Marta", "ci": "G4711", "ni": "11931310534", "ma": "270202", "em": "lauraduquerivera@gmail.com", "te": "3116001506", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "SANCHEZ CASTELLAR CAROLAY VANESSA", "mu": "Pivijay", "ci": "G4771", "ni": "10017994141", "ma": "270227", "em": "carolaysanchez99@gmail.com", "te": "3023397038", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "LABORDE BARRIOS ISRAEL ANTONIO", "mu": "Santa Marta", "ci": "I5611", "ni": "844532346", "ma": "270249", "em": "israel.laborde.golo@gmail.com", "te": "3104939937", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MARTINEZ CANENCIA KAREN GISELLA", "mu": "Santa Marta", "ci": "G4719", "ni": "10817934666", "ma": "270262", "em": "pampanostoresm@gmail.com", "te": "3236502161", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "COMERCIALIZADORA MEM S.A.S.", "mu": "Santa Marta", "ci": "G4620", "ni": "9017278037", "ma": "270259", "em": "montajesmemadmi@gmail.com", "te": "3213817746", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "GUERRERO LOPEZ HENRY DE JESUS", "mu": "Puebloviejo", "ci": "G4723", "ni": "50740170", "ma": "270296", "em": "henryguerrero555@gmail.com", "te": "3242602888", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ROBLES CONSTANTE EDWIN DAVID", "mu": "Santa Marta", "ci": "G4631", "ni": "10829459087", "ma": "206580", "em": "edwinroblessv@gmail.com", "te": "3024136685", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "RAMIREZ MARTINEZ MARIA PATRICIA", "mu": "Plato", "ci": "G4711", "ni": "391002394", "ma": "270293", "em": "neccho@gmail.com", "te": "3215564385", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "AZAR MANTILLA NAZLY LISETH", "mu": "Santa Marta", "ci": "M7310", "ni": "10828807105", "ma": "186882", "em": "publicidadconceptografico@gmail.com", "te": "4224577", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "PRODLICA S.A.S.", "mu": "Santa Marta", "ci": "A0161", "ni": "9010727867", "ma": "188113", "em": "sasprodlica403@gmail.com", "te": "3106154958", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "INVERSIONES MAQUINARIA PESADA Y LOGISTICA DEL CARIBE S.A.S.", "mu": "Santa Marta", "ci": "N7730", "ni": "9008395330", "ma": "168161", "em": "implocsas@gmail.com", "te": "3215405024", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "VALIP S.C.A.", "mu": "Santa Marta", "ci": "L6810", "ni": "9016095581", "ma": "257337", "em": "valipsca@gmail.com", "te": "3170073060", "to": "Sociedad Comandita por Acciones", "es": "Matricula Activa"}, {"s": "ARDILA CASTELLANOS OFELIA", "mu": "Santa Marta", "ci": "G4711", "ni": "378857823", "ma": "52570", "em": "gloria.prada@hotmail.com", "te": "4233549", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "CONTRERAS CASTRO ESMITH", "mu": "Pivijay", "ci": "G4799", "ni": "10828370636", "ma": "270381", "em": "contrerasesmith83@gmail.com", "te": "3222807368", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "AXIOMA INTERVENTORÍA Y OBRAS CIVILES S.A.S.", "mu": "Santa Marta", "ci": "M7112", "ni": "9017305001", "ma": "270445", "em": "axiomaintvyobras@gmail.com", "te": "3023762060", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "KSAS INMOBILIARIA INTERNACIONAL S.A.S.", "mu": "Santa Marta", "ci": "L6810", "ni": "9003386489", "ma": "122529", "em": "sbgenito@hotmail.com", "te": "3002203942", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "PEÑARANDA BERDUGO JOHANA PATRICIA", "mu": "Santa Marta", "ci": "G4773", "ni": "574669825", "ma": "196909", "em": "johannaysantiago25@gmail.com", "te": "3003769118", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "LOPEZ GONZALEZ ORLANDO JAVIER", "mu": "Santa Marta", "ci": "G4631", "ni": "10829013791", "ma": "230792", "em": "mrlopez1@gmail.com", "te": "3207561879", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "LOPEZ FERRER EUNICE MARIA", "mu": "Santa Marta", "ci": "G4711", "ni": "441543948", "ma": "270412", "em": "eunicemarialopezferrer1983@gmail.com", "te": "3136080609", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "BARRAZA RAMOS NOREIDYS", "mu": "Ariguaní", "ci": "J6190", "ni": "10822409747", "ma": "162437", "em": "rubermugno@yahoo.es", "te": "3225408926", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "NORIEGA MONTERO YURANY DEL ROSARIO", "mu": "Ciénaga", "ci": "I5630", "ni": "10828590759", "ma": "270469", "em": "noriegayurany@gmail.com", "te": "3004428812", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "CAMARGO PARDO ALBERTO DE JESUS", "mu": "Santa Marta", "ci": "I5519", "ni": "76020207", "ma": "270510", "em": "albertocamargo30@hotmail.com", "te": "3005632255", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "R.J.R INVERSIONES & SOLUCIONES S.A.S.", "mu": "Santa Marta", "ci": "G4773", "ni": "9017326901", "ma": "270498", "em": "rjrinversionessolucionessas@gmail.com", "te": "3212166947", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "ROUND A ROUND TRAINING CLUB S.A.S", "mu": "Santa Marta", "ci": "R9311", "ni": "9017311581", "ma": "270577", "em": "roundaround306@gmail.com", "te": "3004310380", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "MENDEZ ANGULO ALEXI CECILIA", "mu": "Santa Marta", "ci": "M7310", "ni": "367215733", "ma": "270582", "em": "litoyasantamarta@hotmail.com", "te": "3005514242", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "BUELVA VILLALBA JORGE ARMANDO", "mu": "Santa Marta", "ci": "G4723", "ni": "10822454147", "ma": "190115", "em": "jorgebuelvasvillalba21@gmail.com", "te": "3015655325", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MARTINEZ VILORIA CRISTIAN", "mu": "Santa Marta", "ci": "G4772", "ni": "76285067", "ma": "270639", "em": "cristian1978m@gmail.com", "te": "3002443788", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "GUILLOT PINEDA DAGOBERTO", "mu": "Santa Marta", "ci": "F4330", "ni": "71448980", "ma": "270644", "em": "dagobertoguillot18@gmail.com", "te": "3044427287", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "VALENCIA MEJIA ANA ISABEL", "mu": "El Reten", "ci": "G4711", "ni": "266924536", "ma": "104997", "em": "anaisabel@hotmail.com", "te": "3126401707", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "PEREZ OLARTE VERONICA", "mu": "Santa Marta", "ci": "G4771", "ni": "10828620520", "ma": "214449", "em": "veroperezolarte@hotmail.com", "te": "3182098251", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "SOLUCIONES HERNANDEZ Y HERNANDEZ S.A.S.", "mu": "Santa Marta", "ci": "F4322", "ni": "9017324335", "ma": "270662", "em": "solucioneshernandezyhernandez@gmail.com", "te": "3013616038", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "RODRIGUEZ PRIMERA ALEXANDER JOSE", "mu": "Santa Marta", "ci": "I5630", "ni": "7003289858", "ma": "270682", "em": "lexaderrodriguez0171@gmail.com", "te": "3023727617", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "MEJIA PALOMINO MARLY DE JESUS", "mu": "Santa Marta", "ci": "G4759", "ni": "326876147", "ma": "238098", "em": "purificadorescaribe@hotmail.com", "te": "3002955284", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "IPS LIVING S.A.S.", "mu": "Santa Marta", "ci": "Q8621", "ni": "8190051865", "ma": "72943", "em": "livingcolombiaips@gmail.com", "te": "3013877717", "to": "Sociedad por Acciones Simplificada", "es": "Matricula Activa"}, {"s": "SERRANO VINASCO SOFIA", "mu": "Santa Marta", "ci": "C1081", "ni": "10004699831", "ma": "270746", "em": "sofiaserranov25@gmail.com", "te": "3046439993", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "PALMERA MARTINEZ MARTHA MARIA", "mu": "Fundacion", "ci": "P8512", "ni": "267591746", "ma": "262413", "em": "carmenrosamartinez2016@gmail.com", "te": "3014460186", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "ELIZABETH ELENA BAYTER CALLE", "mu": "Santa Marta", "ci": "F4322", "ni": "10077830948", "ma": "256536", "em": "jimenesjunior265@gmail.com", "te": "3044458639", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "CORTES BENAVIDES YULIANA MELISA", "mu": "Santa Marta", "ci": "C1081", "ni": "10043702474", "ma": "270737", "em": "melisacortes1925@gmail.com", "te": "3044146770", "to": "Persona Natural", "es": "Matricula Activa"}, {"s": "PEREZ GUILLEN LUIS DAVID", "mu": "San Sebastian De Buenavista", "ci": "S9602", "ni": "10824752907", "ma": "270750", "em": "elneneperez91@gmail.com", "te": "3137058819", "to": "Persona Natural", "es": "Matricula Activa"}];
const CLUSTER_MIEMBROS_REALES = {"LOGISTICA": [{"s": "TRANSPASS S.A.S.", "m": "269615", "c": "H4921"}, {"s": "TRANSGOLDEN TRAVEL S.A.S.", "m": "237790", "c": "H4921"}, {"s": "LUBRITRANSPORTES SAS", "m": "270178", "c": "H4923"}, {"s": "DC INVESTMENTS SOLUTIONS SAS", "m": "291441", "c": "H4923"}, {"s": "TRANSPORTES WOL S.A.S.", "m": "274818", "c": "H4923"}, {"s": "MILTON RAFAEL CHARRIS POLO", "m": "241669", "c": "H5011"}, {"s": "CONVENCION TRANSPORTE ESPECIAL S.A.S.", "m": "227582", "c": "H4921"}, {"s": "HENRIQUEZ MIRANDA GABRIEL SEGUNDO", "m": "302138", "c": "H5221"}, {"s": "TRANSPORTES HUMADEA S.A.S.", "m": "114372", "c": "H4923"}, {"s": "OROZCO OROZCO ROSA ISABEL", "m": "280128", "c": "N7710"}, {"s": "SANJUANELO OROZCO JORGE MARIO", "m": "228344", "c": "H4923"}, {"s": "OPERACIONES INTEGRALES DEL CARIBE S.A.S.", "m": "140488", "c": "H5224"}, {"s": "MOVA C&T S.A.S.", "m": "291246", "c": "H5229"}, {"s": "OLARTE PADILLA MERCEDES DE JESUS", "m": "16116", "c": "H4921"}, {"s": "GUERRERO CARVAJALINO MARVIN ALEJANDRO", "m": "299663", "c": "H4923"}, {"s": "LINEAS TECNICAS DE CARGAMENTOS S.A.S -LITECAR S.A.S", "m": "23187", "c": "H4923"}, {"s": "TRANSPORTUR V.I.P S.A.S.", "m": "226109", "c": "H4921"}, {"s": "VALENZUELA LOPEZ NESTOR HENRY", "m": "158082", "c": "H4923"}, {"s": "ANGEL DE DIOS TERNERA CANTILLO", "m": "256171", "c": "H5224"}, {"s": "INTEGRALES HUMANOS S.A.S.", "m": "205122", "c": "H5229"}, {"s": "MEJIA DIAZ LUIS ALBERTO", "m": "217307", "c": "H4921"}, {"s": "THERAN POLO ADALBERTO", "m": "230812", "c": "H4923"}, {"s": "DE VIAJE TRANSPORTE S.A.S.", "m": "287155", "c": "H4921"}, {"s": "MANRIQUE PUELLO PAULO CESAR", "m": "275343", "c": "N7710"}, {"s": "OPERADORA LOGISTICA DEL NORTE S.A.S", "m": "133172", "c": "H5224"}, {"s": "VECTRA LOGISTICA SAS", "m": "302183", "c": "H4923"}, {"s": "TRANSPORTES CSC - SANTA MARTA", "m": "284015", "c": "H4921"}, {"s": "AGENCIA MULTISERVICIOS TRANSEQUIPOS LOGISTICA APURE", "m": "257802", "c": "H4923"}, {"s": "TRIMARES S.A.S.", "m": "240065", "c": "H5229"}, {"s": "TRANSPORTES ELCY S.A.S.", "m": "250159", "c": "H4921"}], "CACAO": [{"s": "JOSE GREGORIO ROA MORENO", "m": "256525", "c": "A0127"}, {"s": "SABORES DE LA SIERRA NEVADA S.A.S.", "m": "274459", "c": "A0127"}, {"s": "CACAOS FINOS COLOMBIANOS S.A.S.", "m": "205918", "c": "A0127"}, {"s": "SAKAI S.A.S", "m": "296830", "c": "A0127"}], "YUCA": [{"s": "ANGARITA HERNANDEZ IRENE", "m": "241796", "c": "A0113"}, {"s": "BUVENO VISTA S.A.S", "m": "290632", "c": "A0113"}, {"s": "AGUIRRE RODRIGUEZ GLORIA ESTELA", "m": "194449", "c": "A0113"}, {"s": "RECURSOS AGRICOLAS DE COLOMBIA S.A.S", "m": "240396", "c": "A0113"}, {"s": "SETAS A-Z SAS", "m": "290729", "c": "A0113"}, {"s": "INVERSIONES JOSEYCA SOCIEDAD EN COMANDITA SIMPLE", "m": "158828", "c": "A0113"}, {"s": "ASCANIO PATIÑO JHONATAN ALEJANDRO", "m": "241521", "c": "A0113"}, {"s": "MABI MAGDALENA S.A.S.", "m": "236937", "c": "A0113"}, {"s": "CULTIVOS E INSUMOS C.H.S. S.A.S.", "m": "264660", "c": "A0113"}, {"s": "TORRES MERIÑO SAMIR JULIAN", "m": "181334", "c": "A0113"}, {"s": "VEGETALES GOURMET SAS", "m": "282792", "c": "A0113"}, {"s": "AGROCENTRO MAGDALENA S.A.S.", "m": "256791", "c": "A0113"}, {"s": "MARIO ALONSO PAVAJEAU ROPAIN", "m": "257562", "c": "A0113"}, {"s": "GONZALEZ GAMEZ SANDRA MILENA", "m": "178668", "c": "A0113"}], "TURISMO": [{"s": "CARDONA RODRIGUEZ YORELIS MARIA", "m": "274913", "c": "I5630"}, {"s": "OSSA GOMEZ MAAYAN OR", "m": "282116", "c": "I5611"}, {"s": "GIL HURTADO TANIA ISABEL", "m": "188669", "c": "I5519"}, {"s": "CARREÑO ARDILA JOSE LUIS", "m": "278443", "c": "I5511"}, {"s": "BEJARANO LOBERA LIBIA", "m": "301372", "c": "I5519"}, {"s": "GUALDRON OSPINA JUAN CAMILO", "m": "291184", "c": "I5611"}, {"s": "MORENO VILLAMIL JUAN MANUEL", "m": "169880", "c": "I5512"}, {"s": "FARELO NORIEGA VITELMA PATRICIA", "m": "176794", "c": "I5611"}, {"s": "PINZON CALDERON ALBERTO", "m": "186944", "c": "I5621"}, {"s": "NUEVO DRAGON CHINO S.A.S.", "m": "232531", "c": "I5611"}, {"s": "MACIAS CARDONA KARINA JUDITH", "m": "224441", "c": "I5611"}, {"s": "FLOREZ MEDINA SANDRA MARCELA", "m": "159269", "c": "I5611"}, {"s": "SANCHEZ ROA CESAR AUGUSTO", "m": "7461", "c": "I5619"}, {"s": "GARCIA VEGA LILIANA INES", "m": "178817", "c": "I5519"}, {"s": "JAROS ONDREJ", "m": "256679", "c": "I5519"}, {"s": "MONTES ESPAÑA LUIS ELIECER", "m": "242199", "c": "I5530"}, {"s": "DANA MARIA LOPEZ PALENCIA", "m": "260783", "c": "I5630"}, {"s": "CLARO SANGUINO LUIS MIGUEL", "m": "293710", "c": "I5630"}, {"s": "PABON CASTRO MARIA CAROLINA", "m": "271163", "c": "I5630"}, {"s": "ORTEGA HERNANDEZ EDILMA ROSA", "m": "293749", "c": "I5611"}, {"s": "YECENIA CARCAMO CANTILLO", "m": "253238", "c": "I5611"}, {"s": "SANTANA RODRIGUEZ JESUS EDUARDO", "m": "221216", "c": "I5519"}, {"s": "TEWIMAKE S.A.S", "m": "301874", "c": "I5511"}, {"s": "AS & JS S.A.S.", "m": "302130", "c": "I5630"}, {"s": "AVILA PEREZ LIDA EUGENIA", "m": "282571", "c": "I5519"}, {"s": "NUÑEZ HENRIQUEZ JOSE MANUEL", "m": "291213", "c": "I5619"}, {"s": "MONICA VIVIANA PRADO PALOMO", "m": "242692", "c": "I5519"}, {"s": "ORTEGA BUITRAGO DARIO", "m": "97097", "c": "I5611"}, {"s": "RAMIREZ RAMIREZ HECTOR DE JESUS", "m": "302161", "c": "I5611"}, {"s": "GALVIS AGUDELO LUIS ARGIRO", "m": "281374", "c": "I5630"}], "MANGO": [{"s": "MATTA JIMENEZ JAVIER", "m": "47314", "c": "A0121"}, {"s": "HOYOS SANDOVAL JEIMIS PAOLA", "m": "291845", "c": "A0121"}, {"s": "INVERSIONES PEGASO S.A.S.", "m": "31742", "c": "A0121"}, {"s": "COMPAÑÍA DE FRUTAS COLOMBIANAS S.A.S.", "m": "204655", "c": "A0121"}, {"s": "AGROMONSA INVERSIONES S.A.S", "m": "260176", "c": "A0121"}, {"s": "CAMPO ARREGOCES SILETH FRANCISCO", "m": "279201", "c": "A0121"}, {"s": "VALERO SIERRA YOLIMA PATRICIA", "m": "162142", "c": "A0121"}, {"s": "BELTRAN CANTILLO GREGORIO", "m": "297431", "c": "A0121"}, {"s": "RURA EXPORTA CIA. LTDA.", "m": "26022", "c": "A0121"}, {"s": "CEBALLOS E HIJOS S. EN C.", "m": "27644", "c": "A0121"}, {"s": "AROMAS DE ATALAYA SAS", "m": "255581", "c": "A0121"}, {"s": "AGROPECUARIA ALJUSTREL S.A.S.", "m": "59282", "c": "A0121"}, {"s": "PREVENCION INVERSIONES S.A.S.", "m": "278386", "c": "A0121"}, {"s": "CAPA HOLDING S.A.S.", "m": "265822", "c": "A0121"}, {"s": "DANGOND OLIVELLA SAS", "m": "29987", "c": "A0121"}, {"s": "INVERSIONES LA VELA S.A.S.", "m": "173324", "c": "A0121"}, {"s": "CARIBEAN LIME S.A.S.", "m": "251696", "c": "A0121"}, {"s": "GLOBAL TROPIC CI S.A.S.", "m": "237467", "c": "A0121"}, {"s": "EL EDÉN HASS COMPANY S.A.S.", "m": "163242", "c": "A0121"}, {"s": "SIERRA NATIVE ORGANICS S.A.S.", "m": "224214", "c": "A0121"}, {"s": "CORREA DELGADO MARTHA CECILIA", "m": "29840", "c": "A0121"}, {"s": "ARIZA ARIZA HERNANDO", "m": "57887", "c": "A0121"}, {"s": "HECTOR JULIO HERRERA CUJIA", "m": "282095", "c": "A0121"}, {"s": "YOLANDA YANET LANDERO BOLAÑO", "m": "272955", "c": "A0121"}, {"s": "FRUTAS DE MACONDO S.A.S.", "m": "196385", "c": "A0121"}, {"s": "INVERSIONES AGRICOLAS S.A. INVERAGRO S.A.", "m": "93026", "c": "A0121"}, {"s": "CODINA PEREZ VILMA SOFIA", "m": "275198", "c": "A0121"}, {"s": "INCOLFRUTA S.A.S", "m": "216436", "c": "A0121"}, {"s": "CS FRUTAS S.A.S.", "m": "253239", "c": "A0121"}, {"s": "PAREJO AHUMADA PEDRO MIGUEL", "m": "125071", "c": "A0121"}], "PALMADEACEITE": [{"s": "MAKALI 1 S.A.S.", "m": "242450", "c": "A0126"}, {"s": "PAANA S.A.S", "m": "274609", "c": "A0126"}, {"s": "MB & ASOCIADOS S.A.S.", "m": "183672", "c": "A0126"}, {"s": "DE LAVALLE RESTREPO LEONARDO", "m": "56911", "c": "A0126"}, {"s": "INVERSIONES SAN PIO S.A.S.", "m": "133431", "c": "A0126"}, {"s": "COMERCIALIZADORA CANAN S.A.S.", "m": "293400", "c": "A0126"}, {"s": "INVERSIONES SANTA PALMA S.A.S. EN LIQUIDACION", "m": "141533", "c": "A0126"}, {"s": "INVERSIONES DUBLIN S.A.S.", "m": "227250", "c": "A0126"}, {"s": "AGRICOLA CANAL AJI S.A.S.", "m": "143173", "c": "A0126"}, {"s": "CEVILA S.A.S.", "m": "181181", "c": "A0126"}, {"s": "AGROINDUSTRIA ENTRE PALMAS S.A.S.", "m": "251423", "c": "A0126"}, {"s": "FRUTOS Y RACIMOS SAS", "m": "256476", "c": "A0126"}, {"s": "AGROCOL V&J S.A.S.", "m": "255593", "c": "A0126"}, {"s": "INSUMOS Y SUMINISTROS AGRICOLAS Y PECUARIOS S.A.S", "m": "287247", "c": "A0126"}, {"s": "AGROGANADERIA MRG GUADALUPE S.A.S", "m": "256312", "c": "A0126"}, {"s": "EXTRACTORA BELLA ESPERANZA LIMITADA", "m": "24717", "c": "A0126"}, {"s": "AGROPALMEIRA S.A.S", "m": "297206", "c": "A0126"}, {"s": "GUTIERREZ PABON MANUEL DE JESUS ENRIQUE", "m": "197559", "c": "A0126"}, {"s": "SERRANO DUARTE JOSE JOAQUIN", "m": "3750", "c": "A0126"}, {"s": "AGRICOLA LA SIRENA S.A.S.", "m": "146730", "c": "A0126"}, {"s": "PALMAS SAN PABLO S.A.S.", "m": "292838", "c": "A0126"}, {"s": "AGROINVERSIONES MACONDO S.A.S", "m": "233219", "c": "A0126"}, {"s": "EL PORTICO MONTERREY S.A.S.", "m": "160499", "c": "A0126"}, {"s": "C.I. PALMARES DEL MAGDALENA MEDIO S.A.S.", "m": "85610", "c": "A0126"}, {"s": "PEREZ MANRIQUE DIEGO", "m": "131017", "c": "A0126"}, {"s": "DACONTE ORTIZ RINA LUZ", "m": "163337", "c": "A0126"}, {"s": "TACALOA  S.A.S.", "m": "97783", "c": "A0126"}, {"s": "GESTORA DE ADMINISTRACIÓN GASA S.A.S", "m": "227670", "c": "A0126"}, {"s": "INVERSIONES HERMANOS W S.A.S.", "m": "292817", "c": "A0126"}, {"s": "CASTAÑEDA MAESTRE VALENTINA MARCELA", "m": "272290", "c": "A0126"}], "BANANO": [{"s": "ACOSTA ZAMBRANO ADELA ROSA", "m": "299394", "c": "A0122"}, {"s": "AGRICOLAS TRAVECEDO Y TAMARA & CIA. SOCIEDAD EN COMANDITA SIMPLE", "m": "92434", "c": "A0122"}, {"s": "CARBONO JULIO ELVIRA ISABEL", "m": "295953", "c": "A0122"}, {"s": "BABRIN S.A.S.", "m": "246842", "c": "A0122"}, {"s": "LOPEZ MARTINEZ JULIO DAVID", "m": "295714", "c": "A0122"}, {"s": "COMPAÑIA BANANERA S.A.S", "m": "70350", "c": "A0122"}, {"s": "SAFTIG AGRICOLA S.A.S.", "m": "213954", "c": "A0122"}, {"s": "MARTINEZ BONETT RAFAEL ANTONIO", "m": "295965", "c": "A0122"}, {"s": "INVERSIONES AGRICOLAS MONTEROSSO S.A.S.", "m": "244250", "c": "A0122"}, {"s": "INVERSIONES R P D S.A.S.", "m": "164504", "c": "A0122"}, {"s": "AGROGRUPO JIMENEZ S.A.S", "m": "296117", "c": "A0122"}, {"s": "BANANERAS DEL MAGDALENA S.A.S.", "m": "247376", "c": "A0122"}, {"s": "CASTRO BERRIO JOSE MOISES", "m": "295746", "c": "A0122"}, {"s": "BANANERA DON MARCE S.A.S.", "m": "89722", "c": "A0122"}, {"s": "FEDERICA S.A.S.", "m": "92022", "c": "A0122"}, {"s": "AGROINVERSIONES C&M S.A.S", "m": "294402", "c": "A0122"}, {"s": "AVILA DURAN CARLOS ENRIQUE", "m": "48324", "c": "A0122"}, {"s": "MAYA BELL Y CIA S. EN C.", "m": "51225", "c": "A0122"}, {"s": "AGROMUSAMA S.A.S", "m": "276513", "c": "A0122"}, {"s": "DE LAS SALAS GONZALEZ GINA MARGARITA", "m": "55650", "c": "A0122"}, {"s": "SERGE RODRIGUEZ FARITH FABIAN", "m": "295710", "c": "A0122"}, {"s": "RODRIGUEZ RUA FRED WILLIAM", "m": "295955", "c": "A0122"}, {"s": "BANANERA EL RUBI S.A.S.", "m": "181368", "c": "A0122"}, {"s": "AGROGOSPA S.A.S.", "m": "238751", "c": "A0122"}, {"s": "BANAFRIOS S.A.S.", "m": "249177", "c": "A0122"}, {"s": "SOCIEDAD AGRICOLA YADIRA S.A.S.", "m": "223232", "c": "A0122"}, {"s": "C.I. LA SAMARIA ORGANIC FAIR TRADE S.A.S.", "m": "100056", "c": "A0122"}, {"s": "PEINADO RODRIGUEZ FRANCISCO", "m": "295713", "c": "A0122"}, {"s": "PEREIRA POMARICO CLARA ELISA", "m": "287137", "c": "A0122"}, {"s": "QUINTERO GOMEZ GUSTAVO RAUL", "m": "295741", "c": "A0122"}], "CAFE": [{"s": "MAZO GARCIA LUDITES", "m": "287963", "c": "A0123"}, {"s": "INVERSIONES J&H S.A.S.", "m": "213693", "c": "A0123"}, {"s": "SERRANERO SAS ZOMAC", "m": "285667", "c": "A0123"}, {"s": "COFFI SIERRA CAFE S.A.S.", "m": "301513", "c": "A0123"}, {"s": "NEVADA CROWN SAS", "m": "296357", "c": "A0123"}, {"s": "CARAT PROPERTIES S.A.S", "m": "206102", "c": "A0123"}, {"s": "DIAZ GRANADOS SAADE ANDRES EDUARDO", "m": "248988", "c": "A0123"}, {"s": "QUINTERO HERNANDEZ MARTIN DARWIN", "m": "154591", "c": "A0123"}, {"s": "KELLY JOHANA GONZALEZ LONDOÑO", "m": "255263", "c": "A0123"}, {"s": "LUIS ERNESTO VEGA BALAGUERA", "m": "244612", "c": "A0123"}, {"s": "SANJUAN PEREZ LAURA MILENA", "m": "283712", "c": "A0123"}, {"s": "HERNANDEZ RUBIO RICARDO ARTURO", "m": "223915", "c": "A0123"}, {"s": "LA PAULINA SM S.A.S", "m": "302051", "c": "A0123"}, {"s": "SIERRA AGROPECUARIA BUENAVISTA S.A.S.", "m": "259348", "c": "A0123"}, {"s": "BALMACIDA ALVAREZ MARIA ANGELICA", "m": "195343", "c": "A0123"}, {"s": "POUR OVER COFFEE EXPORTER S.A.S.", "m": "286317", "c": "A0123"}, {"s": "INVER SEBASTOPOL S.A.S.", "m": "286679", "c": "A0123"}, {"s": "ARIAS GALINDO RUBEN GONZALO", "m": "178359", "c": "A0123"}, {"s": "INVITO CAFÉ S.A.S.", "m": "260934", "c": "A0123"}, {"s": "QUE PODER MI LANZA S.A.S.", "m": "236913", "c": "A0123"}, {"s": "JOSE EDWIN MAYORQUIN CASTRO", "m": "253708", "c": "A0123"}, {"s": "CAFÉ DEL SEVILLA S.A.S", "m": "300850", "c": "A0123"}, {"s": "CUATRO AVENTUREROS SAS", "m": "282337", "c": "A0123"}, {"s": "CARDONA RODRIGUEZ WILSON JAVIER", "m": "206341", "c": "A0123"}, {"s": "CASTILLO BARRANCO ALEJANDRO", "m": "228019", "c": "A0123"}, {"s": "INVERSIONES CIVE S.A.S", "m": "266572", "c": "A0123"}, {"s": "BECERRA SANJUAN IVAN", "m": "287564", "c": "A0123"}, {"s": "PERLA ROJA  S.A.S.", "m": "269323", "c": "A0123"}, {"s": "TOVAR CASAS JAVIER MAURICIO", "m": "78837", "c": "A0123"}, {"s": "BRAYAN CAMILO RODRIGUEZ VELASQUEZ", "m": "287798", "c": "A0123"}]};
const MUNICIPIO_CONTEO = {"SANTA MARTA": 7800, "CIÉNAGA": 536, "FUNDACION": 273, "EL BANCO": 267, "PLATO": 204, "ZONA BANANERA": 163, "ARACATACA": 111, "PIVIJAY": 89, "ARIGUANÍ": 86, "GUAMAL": 65, "SAN SEBASTIAN DE BUENAVISTA": 56, "SANTA ANA": 56, "CHIBOLO": 47, "NUEVA GRANADA": 34, "EL RETEN": 29};
const CLUSTER_CONTEO = {"LOGISTICA": 245, "CACAO": 4, "YUCA": 14, "TURISMO": 245, "MANGO": 52, "PALMADEACEITE": 147, "BANANO": 245, "CAFE": 48};
const TOTAL_REGISTRADOS = 10000;



// ==================== STORAGE (Supabase) ====================
const ADMIN_EMAIL = "camara@rutac.gov.co";

// Helpers de sesión local (solo para caché UI, la verdad está en Supabase)
const saveCurrent = (u) => localStorage.setItem("rutac_session_cache", JSON.stringify(u));
const loadCurrent = () => { try { return JSON.parse(localStorage.getItem("rutac_session_cache")); } catch { return null; } };
const clearCurrent = () => localStorage.removeItem("rutac_session_cache");

// Compatibilidad con admin panel (lee perfiles de Supabase)
const loadUsers = () => { try { return JSON.parse(localStorage.getItem("rutac_users_v3") || "{}"); } catch { return {}; } };

// ==================== HELPERS ====================
function getInitials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "U";
}

function clusterColor(clusterTitulo) {
  return CLUSTERS.find(c => c.titulo === clusterTitulo)?.color || "#0F9B8E";
}

// ==================== ESTILOS BASE ====================
const base = {
  fontFamily: "'DM Sans', system-ui, sans-serif",
  input: {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1.5px solid #D8DDE5", fontSize: 15, outline: "none",
    background: "#fff", boxSizing: "border-box", color: "#1A1A2E"
  },
  inputError: {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1.5px solid #D85A30", fontSize: 15, outline: "none",
    background: "#FFF5F2", boxSizing: "border-box", color: "#1A1A2E"
  },
  label: { fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 4, display: "block" },
  error: { color: "#D85A30", fontSize: 12, marginTop: 3 },
  card: { background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: "1.5rem" },
};

// ==================== COMPONENTES ====================
function Avatar({ name, size = 40, color }) {
  const bg = color || clusterColor(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg + "18", border: `2px solid ${bg}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: Math.round(size * 0.38), color: bg,
      flexShrink: 0, letterSpacing: 0.5
    }}>
      {getInitials(name)}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", full = false, disabled = false, small = false }) {
  const styles = {
    primary: { background: "#0F9B8E", color: "#fff", border: "none" },
    secondary: { background: "#fff", color: "#0F9B8E", border: "1.5px solid #0F9B8E" },
    ghost: { background: "transparent", color: "#555", border: "1.5px solid #D8DDE5" },
    danger: { background: "#FFF0EE", color: "#D85A30", border: "1.5px solid #FFCDC4" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant],
      padding: small ? "7px 16px" : "11px 24px",
      borderRadius: 10, fontWeight: 600, fontSize: small ? 13 : 15,
      width: full ? "100%" : "auto", cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1, fontFamily: "'DM Sans', sans-serif",
      transition: "opacity .15s", whiteSpace: "nowrap"
    }}>
      {children}
    </button>
  );
}

function Badge({ children, color = "#0F9B8E" }) {
  return (
    <span style={{
      background: color + "18", color, border: `1px solid ${color}40`,
      borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600
    }}>
      {children}
    </span>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={base.label}>{label}</label>}
      {children}
      {error && <p style={base.error}>{error}</p>}
    </div>
  );
}

// ==================== LOGIN ====================
function LoginPage({ onLogin, onRegister, darkMode, onToggleDark }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pass) { setErr("Completa todos los campos"); return; }
    setLoading(true);
    setErr("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: pass,
    });

    if (error) {
      setErr("Correo o contraseña incorrectos");
      setLoading(false);
      return;
    }

    // Fetch perfil del usuario
    const { data: perfil } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    const user = {
      ...perfil,
      id: data.user.id,
      email: data.user.email,
      razonSocial: perfil?.razon_social || perfil?.razonSocial || data.user.user_metadata?.razon_social || "Usuario",
      role: perfil?.role || data.user.user_metadata?.role || "user",
    };
    saveCurrent(user);
    onLogin(user);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: darkMode ? "#0F1117" : "#EEF3F8", fontFamily: base.fontFamily, display: "flex", flexDirection: "column" }}>
      <nav style={{ background: "#fff", borderBottom: "1px solid #EAEAEA", padding: "0 2rem", display: "flex", alignItems: "center", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#0F9B8E", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18 }}>C</div>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Ruta <span style={{ color: "#0F9B8E" }}>C</span> Conecta</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 14, color: "#333", fontWeight: 500 }}>Iniciar sesión</span>
          <div onClick={onToggleDark} style={{ width: 34, height: 34, borderRadius: 8, border: "1.5px solid #D8DDE5", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: darkMode ? "#1A1A2E" : "#fff" }}>
            {darkMode
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            }
          </div>
        </div>
      </nav>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 420, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <p style={{ color: "#0F9B8E", fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 10px", textAlign: "center" }}>ACCESO EMPRENDEDOR</p>
          <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, textAlign: "center", color: "#1A1A2E" }}>Bienvenido de vuelta</h2>
          <p style={{ color: "#888", marginBottom: 28, fontSize: 14, textAlign: "center" }}>Entra para ver tus recomendaciones del día.</p>
          <div style={{ marginBottom: 14 }}>
            <label style={base.label}>Email <span style={{ color: "#D85A30" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input value={email} onChange={e => { setEmail(e.target.value); setErr(""); }}
                placeholder="tunegocio@gmail.com" style={{ ...base.input, paddingLeft: 40 }}
                onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={base.label}>Contraseña <span style={{ color: "#D85A30" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(""); }}
                placeholder="Mínimo 8 caracteres" style={{ ...base.input, paddingLeft: 40 }}
                onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
          </div>
          {err && <p style={{ color: "#D85A30", fontSize: 12, marginBottom: 12, textAlign: "center" }}>{err}</p>}
          <button onClick={handleLogin} disabled={loading} style={{
            width: "100%", padding: "14px", background: loading ? "#aaa" : "#0F9B8E", color: "#fff",
            border: "none", borderRadius: 12, fontWeight: 700, fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer", fontFamily: base.fontFamily
          }}>{loading ? "Entrando..." : "Entrar →"}</button>
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#555" }}>
            ¿Aún no tienes cuenta?{" "}
            <span onClick={onRegister} style={{ color: "#0F9B8E", cursor: "pointer", fontWeight: 600 }}>Regístrate gratis</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== REGISTRO 4 PASOS ====================
function RegisterPage({ onDone, onLogin }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    razonSocial: "", registradoCamara: "", nit: "", sector: "", tiempoOperando: "", descripcion: "",
    municipio: "Santa Marta", barrio: "", whatsapp: "", email: "", password: "", confirm: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setTouched(t => ({ ...t, [k]: true }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.razonSocial.trim()) e.razonSocial = "El nombre del negocio es obligatorio";
      if (!form.registradoCamara) e.registradoCamara = "Selecciona una opción";
      if (form.registradoCamara === "si" && !form.nit.trim()) e.nit = "El NIT es obligatorio para empresas registradas";
      if (!form.sector) e.sector = "Selecciona un sector";
      if (!form.tiempoOperando) e.tiempoOperando = "Selecciona un rango";
    }
    if (step === 2) {
      if (!form.barrio) e.barrio = "Selecciona un barrio o vereda";
      if (!/^\d{10}$/.test(form.whatsapp)) e.whatsapp = "Debe tener exactamente 10 dígitos";
    }
    if (step === 3) {
      // review step — just check terms
    }
    if (step === 4) {
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Ingresa un email válido";
      if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
      if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = async () => {
    if (!validateStep()) return;
    if (step === 4) {
      setLoading(true);
      const emailClean = form.email.toLowerCase().trim();

      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailClean,
        password: form.password,
        options: {
          data: { razon_social: form.razonSocial, role: "user" }
        }
      });

      if (authError) {
        if (authError.message.includes("already registered") || authError.message.includes("User already registered")) {
          setErrors({ email: "Ya existe una cuenta con este correo" });
        } else {
          setErrors({ email: "Error: " + authError.message });
        }
        setLoading(false);
        return;
      }
      // Handle email confirmation requirement
      if (!authData?.user) {
        setErrors({ email: "Revisa tu correo para confirmar la cuenta" });
        setLoading(false);
        return;
      }

      // 2. Upsert perfil con todos los datos del formulario
      const matricula = "R" + Date.now().toString().slice(-6);
      const { error: profileError } = await supabase
        .from("perfiles")
        .upsert({
          id: authData.user.id,
          razon_social: form.razonSocial,
          nit: form.nit || null,
          cluster: form.sector,
          etapa: "Inicio",
          municipio: form.municipio,
          barrio: form.barrio,
          whatsapp: form.whatsapp,
          descripcion: form.descripcion,
          tiempo_operando: form.tiempoOperando,
          registrado_camara: form.registradoCamara,
          completitud: 70,
          matricula: matricula,
          role: "user",
        }, { onConflict: "id" });

      if (profileError) {
        console.error("Error perfil:", profileError.message);
      }

      // Re-fetch the profile to get the latest data from Supabase
      const { data: freshProfile } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      const newUser = {
        ...(freshProfile || {}),
        id: authData.user.id,
        email: emailClean,
        razon_social: form.razonSocial,
        razonSocial: form.razonSocial,
        cluster: form.sector,
        etapa: "Inicio",
        municipio: form.municipio,
        barrio: form.barrio,
        whatsapp: form.whatsapp,
        descripcion: form.descripcion,
        nit: form.nit || null,
        matricula,
        role: "user",
        completitud: 70,
      };

      saveCurrent(newUser);
      setLoading(false);
      onDone(newUser);
    } else {
      setStep(s => s + 1);
    }
  };

  const STEP_TITLES = ["Tu negocio", "¿Dónde te encontramos?", "Revisa antes de enviar", "Crea tu acceso"];

  const leftContent = [
    { tag: "¡BIENVENIDO A TU RUTA!", headline: "Conecta tu negocio con más clientes en Santa Marta 100% gratis", sub: "Únete a la red que está transformando la economía local. Posiciona tu negocio, gestiona pedidos y conecta con la comunidad samaria." },
    { tag: "¡BIENVENIDO A TU RUTA!", headline: "Conecta tu negocio con más clientes en Santa Marta 100% gratis", sub: "Únete a la red que está transformando la economía local." },
    { tag: "¡BIENVENIDO A TU RUTA!", headline: "Conecta tu negocio con más clientes en Santa Marta 100% gratis", sub: "Verifica que todo esté correcto antes de continuar." },
    { tag: "¡BIENVENIDO A TU RUTA!", headline: "Conecta tu negocio con más clientes en Santa Marta 100% gratis", sub: "Crea tu acceso seguro para gestionar tu negocio." },
  ];

  const left = leftContent[step - 1];
  const progressPct = (step / 4) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "#EEF3F8", display: "flex", fontFamily: base.fontFamily }}>
      {/* Left panel */}
      <div style={{ flex: "0 0 45%", background: "#F0F6FF", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "3rem 3.5rem", position: "relative", overflow: "hidden" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#0F9B8E", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18 }}>C</div>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Ruta <span style={{ color: "#0F9B8E" }}>C</span> Conecta</span>
          <span onClick={onLogin} style={{ marginLeft: "auto", fontSize: 13, color: "#0F9B8E", cursor: "pointer", fontWeight: 600 }}>Iniciar sesión</span>
        </div>

        {/* Content */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#E8F5EE", border: "1px solid #B2DFD3", borderRadius: 20, padding: "5px 14px", marginBottom: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#0F9B8E" }}>{left.tag}</span>
          </div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, lineHeight: 1.15, color: "#1A1A2E", margin: "0 0 16px" }}>
            {left.headline.replace("100% gratis", "")}
            <span style={{ color: "#0F9B8E" }}>100% gratis</span>
          </h1>
          <p style={{ color: "#555", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>{left.sub}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E0E0E0", borderRadius: 20, padding: "7px 16px" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#0F9B8E", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 10 }}>✓</span>
            </div>
            <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>+500 negocios ya confían en Ruta C</span>
          </div>

          {/* Image placeholder */}
          <div style={{ marginTop: 32, borderRadius: 16, overflow: "hidden", position: "relative", background: "#1A1A2E" }}>
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=350&fit=crop" alt="" style={{ width: "100%", height: 220, objectFit: "cover", opacity: 0.7 }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem 1.2rem", background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: "#0F9B8E", padding: "2px 10px", borderRadius: 20 }}>HECHO PARA EMPRENDEDORES</span>
              </div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, margin: "0 0 4px" }}>Tu negocio, en el mapa de Santa Marta</p>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, margin: 0 }}>La Cámara de Comercio te conecta con clientes, aliados y proveedores cerca de ti.</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div style={{ height: 4, background: "#E0E0E0", borderRadius: 4, marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "#0F9B8E", borderRadius: 4, transition: "width .3s" }} />
          </div>
          <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Paso {step} de 4</p>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", overflowY: "auto" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 500, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>
          <p style={{ color: "#0F9B8E", fontWeight: 600, fontSize: 13, margin: "0 0 6px" }}>PASO {step} DE 4</p>
          <h2 style={{ margin: "0 0 24px", fontSize: 24 }}>{STEP_TITLES[step - 1]}</h2>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <Field label="Nombre del negocio *" error={errors.razonSocial}>
                <input value={form.razonSocial} onChange={e => update("razonSocial", e.target.value)}
                  placeholder="Empanadas Doña Marleny"
                  style={errors.razonSocial ? base.inputError : base.input} />
                <span style={{ fontSize: 12, color: "#888" }}>Como te conocen los clientes</span>
              </Field>

              <Field label="¿Estás registrado en la Cámara de Comercio? *" error={errors.registradoCamara}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { val: "si", title: "Sí, ya estoy registrado", sub: "Tengo NIT y registro mercantil vigente." },
                    { val: "no", title: "No, todavía no", sub: "Soy un negocio informal o estoy empezando." }
                  ].map(opt => (
                    <div key={opt.val} onClick={() => update("registradoCamara", opt.val)} style={{
                      padding: "14px", borderRadius: 10, cursor: "pointer",
                      border: form.registradoCamara === opt.val ? "2px solid #0F9B8E" : "1.5px solid #D8DDE5",
                      background: form.registradoCamara === opt.val ? "#E1F5EE" : "#fff"
                    }}>
                      <p style={{ fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>{opt.title}</p>
                      <p style={{ fontSize: 12, color: "#666", margin: 0 }}>{opt.sub}</p>
                    </div>
                  ))}
                </div>
              </Field>

              {form.registradoCamara === "si" && (
                <Field label="NIT *" error={errors.nit}>
                  <input
                    value={form.nit}
                    onChange={e => update("nit", e.target.value.replace(/[^0-9\-]/g, ""))}
                    placeholder="800170340-1"
                    style={errors.nit ? base.inputError : base.input}
                  />
                  <span style={{ fontSize: 12, color: "#888" }}>Número de Identificación Tributaria de tu empresa</span>
                </Field>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Sector *" error={errors.sector}>
                  <select value={form.sector} onChange={e => update("sector", e.target.value)}
                    style={errors.sector ? base.inputError : base.input}>
                    <option value="">Selecciona un sector</option>
                    {CLUSTERS.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}
                  </select>
                </Field>
                <Field label="¿Hace cuánto tiempo operas? *" error={errors.tiempoOperando}>
                  <select value={form.tiempoOperando} onChange={e => update("tiempoOperando", e.target.value)}
                    style={errors.tiempoOperando ? base.inputError : base.input}>
                    <option value="">Selecciona un rango</option>
                    {TIEMPOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Cuéntanos qué haces *">
                <textarea value={form.descripcion} onChange={e => update("descripcion", e.target.value)}
                  placeholder="Vendo empanadas frente al edificio Bavaria, abro de 7 am a 3 pm. Hago de pollo, carne y queso."
                  maxLength={280}
                  style={{ ...base.input, minHeight: 100, resize: "vertical" }} />
                <span style={{ fontSize: 12, color: "#888" }}>{form.descripcion.length}/280</span>
              </Field>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>Esto nos ayuda a conectarte con clientes y aliados cerca de ti.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Municipio *">
                  <select value={form.municipio} onChange={e => { update("municipio", e.target.value); update("barrio", ""); }}
                    style={base.input}>
                    {MUNICIPIOS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <span style={{ fontSize: 12, color: "#888" }}>Magdalena</span>
                </Field>
                <Field label="Barrio o vereda *" error={errors.barrio}>
                  <select value={form.barrio} onChange={e => update("barrio", e.target.value)}
                    style={errors.barrio ? base.inputError : base.input}>
                    <option value="">Selecciona</option>
                    {(MUNICIPIOS_BARRIOS[form.municipio] || []).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <span style={{ fontSize: 12, color: "#888" }}>Donde está tu negocio</span>
                </Field>
              </div>

              <Field label="WhatsApp *" error={errors.whatsapp}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ background: "#F5F5F5", border: "1.5px solid #D8DDE5", borderRadius: 8, padding: "11px 14px", fontWeight: 600, fontSize: 15, color: "#333", whiteSpace: "nowrap" }}>+57</div>
                  <input value={form.whatsapp} maxLength={10}
                    onChange={e => update("whatsapp", e.target.value.replace(/\D/g, ""))}
                    placeholder="3158709635"
                    style={{ ...base.input, ...(errors.whatsapp ? { borderColor: "#D85A30", background: "#FFF5F2" } : {}) }} />
                </div>
                <span style={{ fontSize: 12, color: "#888" }}>Te escribiremos por aquí</span>
              </Field>

              <Field label="Email">
                <input value={form.email} onChange={e => update("email", e.target.value)}
                  placeholder="mafalvarado28@gmail.com" style={base.input} />
                <span style={{ fontSize: 12, color: "#888" }}>Opcional. Te enviaremos recursos y novedades.</span>
              </Field>
            </>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>Verifica que todo esté correcto. Puedes editar cualquier sección.</p>
              <ReviewSection title="Tu negocio" onEdit={() => setStep(1)} rows={[
                ["NOMBRE DEL NEGOCIO", form.razonSocial],
                ["¿ESTÁS REGISTRADO EN LA CÁMARA DE COMERCIO?", form.registradoCamara === "si" ? "Sí, ya estoy registrado" : "No, todavía no"],
                ...(form.registradoCamara === "si" ? [["NIT", form.nit]] : []),
                ["SECTOR", form.sector],
                ["¿HACE CUÁNTO TIEMPO OPERAS?", form.tiempoOperando],
                ["CUÉNTANOS QUÉ HACES", form.descripcion],
              ]} />
              <ReviewSection title="¿Dónde te encontramos?" onEdit={() => setStep(2)} rows={[
                ["MUNICIPIO", form.municipio],
                ["BARRIO O VEREDA", form.barrio],
                ["WHATSAPP", form.whatsapp ? `+57 ${form.whatsapp}` : "—"],
                ["EMAIL", form.email || "—"],
              ]} />
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#F8F9FA", borderRadius: 10, padding: "14px 16px", marginTop: 12 }}>
                <input type="checkbox" id="terms" defaultChecked style={{ marginTop: 3 }} />
                <label htmlFor="terms" style={{ fontSize: 14, color: "#555", lineHeight: 1.5 }}>
                  Acepto los <span style={{ color: "#0F9B8E", fontWeight: 600 }}>términos y políticas de privacidad</span> de la Cámara de Comercio de Santa Marta.
                </label>
              </div>
            </>
          )}

          {/* STEP 4: Account */}
          {step === 4 && (
            <>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>Crea tu contraseña para acceder a tu cuenta.</p>
              <Field label="Correo electrónico *" error={errors.email}>
                <input value={form.email} onChange={e => update("email", e.target.value)}
                  placeholder="tu@correo.com"
                  style={errors.email ? base.inputError : base.input} />
              </Field>
              <Field label="Contraseña (mín. 8 caracteres) *" error={errors.password}>
                <input type="password" value={form.password} onChange={e => update("password", e.target.value)}
                  placeholder="••••••••"
                  style={errors.password ? base.inputError : base.input} />
              </Field>
              <Field label="Confirmar contraseña *" error={errors.confirm}>
                <input type="password" value={form.confirm} onChange={e => update("confirm", e.target.value)}
                  placeholder="••••••••"
                  style={errors.confirm ? base.inputError : base.input} />
              </Field>
            </>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            {step > 1 && <Btn variant="ghost" onClick={() => setStep(s => s - 1)}>← Atrás</Btn>}
            <Btn full onClick={next} disabled={loading}>
              {step === 4 ? (loading ? "Creando cuenta..." : "Crear mi perfil") : "Continuar →"}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewSection({ title, onEdit, rows }) {
  return (
    <div style={{ border: "1.5px solid #E8E8E8", borderRadius: 12, padding: "18px 20px", marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>{title}</h3>
        <button onClick={onEdit} style={{ background: "none", border: "none", color: "#0F9B8E", cursor: "pointer", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
          ✎ Editar
        </button>
      </div>
      {rows.map(([k, v]) => v && (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderTop: "1px solid #F0F0F0" }}>
          <span style={{ fontSize: 12, color: "#888", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#1A1A2E", textAlign: "right", maxWidth: "55%" }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ==================== USER MENU DROPDOWN ====================
function UserMenu({ user, onLogout, onNavigate }) {
  const [open, setOpen] = useState(false);
  const displayName = user?.razonSocial || user?.razon_social || "Usuario";
  const color = clusterColor(user?.cluster);

  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 8px", borderRadius: 8, background: open ? "#F0F0F0" : "transparent" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: color + "20", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color }}>
          {getInitials(displayName)}
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#333", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName.split(" ")[0]}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}><polyline points="6 9 12 15 18 9"/></svg>
      </div>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
          <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #EAEAEA", minWidth: 220, zIndex: 200, overflow: "hidden" }}>
            {/* Profile header */}
            <div style={{ padding: "16px", borderBottom: "1px solid #F0F0F0", background: "#F8F9FA" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: color + "20", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color }}>
                  {getInitials(displayName)}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#1A1A2E" }}>{displayName}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{user?.email}</p>
                  {user?.cluster && <p style={{ margin: "2px 0 0", fontSize: 11, color, fontWeight: 600 }}>{user.cluster}</p>}
                </div>
              </div>
            </div>

            {/* Menu items */}
            {[
              { label: "Mi perfil", icon: "👤", page: "Mi negocio" },
              { label: "Mis conexiones", icon: "🔗", page: "Conexiones" },
              { label: "Recomendaciones", icon: "⭐", page: "Recomendaciones" },
            ].map(item => (
              <button key={item.label} onClick={() => { onNavigate(item.page); setOpen(false); }} style={{
                width: "100%", padding: "11px 16px", background: "none", border: "none",
                textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                fontSize: 14, color: "#333", fontFamily: base.fontFamily
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#F5F5F5"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <span>{item.icon}</span>{item.label}
              </button>
            ))}

            <div style={{ borderTop: "1px solid #F0F0F0", margin: "4px 0" }} />
            <button onClick={onLogout} style={{
              width: "100%", padding: "11px 16px", background: "none", border: "none",
              textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
              fontSize: 14, color: "#D85A30", fontFamily: base.fontFamily
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#FFF5F2"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              <span>🚪</span>Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ==================== NAVBAR ====================
function Navbar({ user, page, setPage, onLogout }) {
  const navItems = user?.role === "admin"
    ? ["Dashboard", "Empresas", "Clusters", "Reportes"]
    : ["Inicio", "Recomendaciones", "Mi clúster", "Conexiones", "Marketplace", "Formalización", "Mi negocio"];

  return (
    <nav style={{
      background: "#fff", borderBottom: "1px solid #EAEAEA",
      padding: "0 2rem", display: "flex", alignItems: "center", gap: "1.5rem",
      position: "sticky", top: 0, zIndex: 100, height: 58
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 7, background: "#0F9B8E", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path d="M1 7C3 3 6 1 9 1C12 1 15 3 17 7C15 11 12 13 9 13C6 13 3 11 1 7Z" stroke="#fff" strokeWidth="1.5" fill="none"/>
            <circle cx="9" cy="7" r="2.5" stroke="#fff" strokeWidth="1.5"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 17 }}>Ruta <span style={{ color: "#0F9B8E" }}>C</span></span>
      </div>

      {navItems.map(p => (
        <button key={p} onClick={() => setPage(p)} style={{
          background: "none", border: "none", fontWeight: page === p ? 600 : 400,
          color: page === p ? "#0F9B8E" : "#555", fontSize: 14,
          borderBottom: page === p ? "2px solid #0F9B8E" : "2px solid transparent",
          padding: "20px 2px", cursor: "pointer", fontFamily: base.fontFamily, whiteSpace: "nowrap"
        }}>{p}</button>
      ))}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </button>
        <UserMenu user={user} onLogout={onLogout} onNavigate={setPage} />
      </div>
    </nav>
  );
}

// ==================== INICIO ====================
function InicioPage({ user, onNavigate }) {
  const cluster = CLUSTERS.find(c => c.titulo === user.cluster);
  const completitud = user.completitud || 70;
  const [kpis, setKpis] = useState({ vistas: null, conexiones: null, recomendaciones: null, productos: null });

  useEffect(() => {
    // Load real metrics
    const loadMetrics = async () => {
      // 1. Conexiones activas: count perfiles in same cluster (proxy)
      const { data: clusterPeers } = await supabase
        .from("perfiles")
        .select("id")
        .eq("cluster", user.cluster)
        .neq("id", user.id);

      // 2. Count recomendaciones (all non-admin profiles)
      const { data: allP } = await supabase
        .from("perfiles")
        .select("id, cluster, municipio, etapa, completitud")
        .neq("id", user.id)
        .neq("role", "admin");

      // 3. Count own products from localStorage
      let ownProds = 0;
      try { ownProds = JSON.parse(localStorage.getItem("rutac_productos_" + user.id) || "[]").length; } catch {}

      // Score-based recommendation count
      const recCount = (allP || []).filter(p => {
        let s = 0;
        if (p.cluster === user.cluster) s += 35;
        if (p.municipio === user.municipio) s += 20;
        return s > 20;
      }).length;

      setKpis({
        vistas: Math.floor(Math.random() * 40) + 10, // simulated weekly views
        conexiones: clusterPeers?.length || 0,
        recomendaciones: recCount,
        productos: ownProds,
      });
    };
    loadMetrics();
  }, [user.id, user.cluster]);

  const kpiCards = [
    { label: "Conexiones en tu clúster", val: kpis.conexiones === null ? "..." : kpis.conexiones, sub: `Empresas en ${user.cluster || "tu sector"}`, icon: "🔗" },
    { label: "Recomendaciones IA", val: kpis.recomendaciones === null ? "..." : kpis.recomendaciones, sub: "Actores con alta afinidad", icon: "⭐" },
    { label: "Mis productos activos", val: kpis.productos === null ? "..." : kpis.productos, sub: kpis.productos === 0 ? "¡Agrega tu primer producto!" : "Visibles en Marketplace", icon: "🛍️" },
    { label: "Completitud del perfil", val: `${completitud}%`, sub: "Mejora tu visibilidad", icon: "📊" },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      {/* Welcome */}
      <div style={{ background: "linear-gradient(135deg, #0F9B8E, #185FA5)", borderRadius: 18, padding: "2rem 2.5rem", color: "#fff", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: "0 0 6px", opacity: 0.85, fontSize: 14 }}>Bienvenido de vuelta</p>
          <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800 }}>{user.razonSocial || user.razon_social}</h1>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {cluster && <Badge color="#fff">{cluster.titulo}</Badge>}
            {user.municipio && <Badge color="#fff">{user.municipio}</Badge>}
            {user.etapa && <Badge color="#fff">Etapa: {user.etapa}</Badge>}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", border: "3px solid rgba(255,255,255,0.4)", position: "relative" }}>
            <svg viewBox="0 0 36 36" width="80" height="80" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5"/>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray={`${completitud} ${100 - completitud}`} strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 18, fontWeight: 800, position: "relative" }}>{completitud}%</span>
            <span style={{ fontSize: 9, opacity: 0.8, position: "relative" }}>Perfil</span>
          </div>
        </div>
      </div>

      {/* KPI Cards — real data */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {kpiCards.map(k => (
          <div key={k.label} style={{ ...base.card }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <p style={{ margin: "0 0 4px", fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{k.label}</p>
              <span style={{ fontSize: 20 }}>{k.icon}</span>
            </div>
            <h2 style={{ margin: "0 0 2px", fontSize: 32, fontWeight: 800, color: "#0F9B8E" }}>{k.val}</h2>
            <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Completitud bar + tips */}
      {completitud < 100 && (
        <div style={{ ...base.card, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16 }}>Completa tu perfil</h3>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666" }}>Un perfil completo recibe 3x más conexiones y aparece más en el Marketplace</p>
            </div>
            <span style={{ fontWeight: 700, color: "#0F9B8E", fontSize: 20 }}>{completitud}%</span>
          </div>
          <div style={{ height: 8, background: "#F0F0F0", borderRadius: 4, marginBottom: 14 }}>
            <div style={{ height: "100%", width: `${completitud}%`, background: "linear-gradient(90deg, #0F9B8E, #185FA5)", borderRadius: 4, transition: "width .5s" }} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              !user.descripcion && { label: "Agrega descripción de tu negocio", page: "Mi negocio" },
              !(kpis.productos > 0) && { label: "Sube fotos de tus productos", page: "Mi negocio" },
              !user.whatsapp && { label: "Agrega tu WhatsApp", page: "Mi negocio" },
              !user.barrio && { label: "Agrega tu barrio", page: "Mi negocio" },
            ].filter(Boolean).slice(0, 3).map(t => (
              <span key={t.label} onClick={() => onNavigate && onNavigate(t.page)} style={{ background: "#FFF9E6", color: "#BA7517", border: "1px solid #FFE0A0", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                {t.label} →
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Clusters */}
      <div style={{ ...base.card }}>
        <h3 style={{ margin: "0 0 16px" }}>Clústeres activos en el Magdalena</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {CLUSTERS.map(c => (
            <div key={c.id} style={{ background: c.bgLight, borderRadius: 10, padding: "14px", border: user.cluster === c.titulo ? `2px solid ${c.color}` : "2px solid transparent", position: "relative" }}>
              {user.cluster === c.titulo && <span style={{ position: "absolute", top: 8, right: 8, fontSize: 9, background: c.color, color: "#fff", borderRadius: 10, padding: "2px 6px", fontWeight: 700 }}>TÚ</span>}
              <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 14, color: c.color }}>{c.titulo}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#555" }}>{c.total} empresas</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== RECOMENDACIONES ====================
function RecomendacionesPage({ user }) {
  const actors = [
    { id: 1, initials: "CD", name: "CASTILLO DE HORTA KESSIA ORNELLA", desc: "Tienda de abarrotes y productos de consumo masivo en el centro de Santa Marta. Atiende a más de 80 familias diariamente con productos frescos y empacados.", city: "SANTA MARTA", ciiu: "G4719", match: 89, tipo: "Cliente potencial", nueva: true, sector: "Comercio al por menor", imgs: ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop", "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&h=200&fit=crop"] },
    { id: 2, initials: "ZB", name: "ZUÑIGA BELTRAN TOMAS ALFONSO", desc: "Distribuidora de bebidas y snacks para el canal tradicional. Cubre los barrios Pescaíto, Mamatoco y Bastidas con entregas diarias.", city: "SANTA MARTA", ciiu: "G4719", match: 85, tipo: "Cliente potencial", nueva: false, sector: "Distribución", imgs: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop"] },
    { id: 3, initials: "DD", name: "DIANA DEL CARMEN RUDAS URIELES", desc: "Comercializadora de frutas y verduras frescas de la Sierra Nevada. Proveedora de restaurantes, hoteles y supermercados de la ciudad.", city: "SANTA MARTA", ciiu: "G4721", match: 82, tipo: "Aliado", nueva: false, sector: "Productos agrícolas", imgs: ["https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=300&h=200&fit=crop", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=200&fit=crop"] },
    { id: 4, initials: "LY", name: "LORENA YOLIMA AVENDAÑO MIRANDA", desc: "Punto de venta especializado en productos orgánicos y de la canasta familiar. Ubicada en El Rodadero, sirve a turistas y residentes.", city: "SANTA MARTA", ciiu: "G4721", match: 79, tipo: "Aliado", nueva: false, sector: "Tienda especializada", imgs: ["https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=300&h=200&fit=crop"] },
    { id: 5, initials: "AB", name: "AVENDAÑO BELLO EDWIN ANDRES", desc: "Carnicería y pescadería con más de 15 años en el mercado samario. Proveedor certificado de proteínas para cadenas hoteleras y restaurantes.", city: "SANTA MARTA", ciiu: "G4723", match: 76, tipo: "Proveedor", nueva: false, sector: "Carnes y mariscos", imgs: ["https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=200&fit=crop"] },
    { id: 6, initials: "PT", name: "PEREZ TORRES JULIA HORTENCIA", desc: "Distribuidora de productos del mar y mariscos frescos del Pacífico. Logística de frío propia para garantizar calidad en toda la cadena.", city: "SANTA MARTA", ciiu: "G4723", match: 71, tipo: "Referente", nueva: false, sector: "Productos del mar", imgs: ["https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=300&h=200&fit=crop"] },
  ];

  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("Todas");
  const tabs = ["Todas", "Proveedor", "Aliado", "Cliente", "Referente"];
  const tipoColor = { "Cliente potencial": "#185FA5", "Aliado": "#0F9B8E", "Proveedor": "#BA7517", "Referente": "#9C27B0" };

  const filtered = tab === "Todas" ? actors : actors.filter(a => a.tipo.includes(tab));

  return (
    <div style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: "0 0 6px", fontSize: 26 }}>Recomendaciones</h1>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>{actors.length} actores priorizados para {user.razonSocial} · actualizado hace 3 horas</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" small>Filtros</Btn>
          <Btn variant="ghost" small>Ordenar: score</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: "2px solid #EAEAEA" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: "none", border: "none", padding: "10px 16px",
            fontWeight: tab === t ? 600 : 400, color: tab === t ? "#0F9B8E" : "#666",
            borderBottom: tab === t ? "2px solid #0F9B8E" : "2px solid transparent",
            cursor: "pointer", fontSize: 14, fontFamily: base.fontFamily,
            marginBottom: -2
          }}>{t} {t === "Todas" ? actors.length : actors.filter(a => a.tipo.includes(t)).length}</button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EAEAEA", overflow: "hidden" }}>
        <div style={{ padding: "10px 20px", background: "#F8F9FA", fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: 0.5, textTransform: "uppercase" }}>ACTOR</div>
        {filtered.map((a, i) => (
          <div key={a.id} onClick={() => setSelected(a)} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
            borderTop: "1px solid #F0F0F0", cursor: "pointer",
            background: selected?.id === a.id ? "#F0FBF9" : "transparent",
            transition: "background .15s"
          }}>
            <Avatar name={a.initials} size={38} color={tipoColor[a.tipo]} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14 }}>{a.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.desc}</p>
            </div>
            <Badge color={tipoColor[a.tipo]}>{a.tipo}</Badge>
          </div>
        ))}
        <div style={{ padding: "12px", textAlign: "center", fontSize: 13, color: "#888", borderTop: "1px solid #F0F0F0" }}>
          Mostrando {filtered.length} de {actors.length}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "flex-end", zIndex: 200 }}>
          <div style={{ background: "#fff", width: 420, height: "100%", overflowY: "auto", padding: "1.5rem", position: "relative" }}>
            <button onClick={() => setSelected(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>×</button>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
              <Avatar name={selected.initials} size={48} color={tipoColor[selected.tipo]} />
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: 15 }}>{selected.name}</h3>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#666" }}>{selected.sector}</p>
                <div style={{ display: "flex", gap: 6 }}>
                  {selected.nueva && <Badge color="#BA7517">Nueva</Badge>}
                </div>
              </div>
            </div>
            {selected.imgs?.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
                {selected.imgs.map((img, i) => (
                  <img key={i} src={img} alt="" style={{ width: 140, height: 90, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                ))}
              </div>
            )}
            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 16 }}>{selected.desc}</p>

            <div style={{ background: "#F8F9FA", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
              <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888", fontWeight: 600 }}>MATCH</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: "#1A1A2E" }}>{selected.match}%</span>
                <Badge color={tipoColor[selected.tipo]}>{selected.tipo}</Badge>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>¿Por qué a ti?</p>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                Las empresas del sector {selected.ciiu} suelen complementar con negocios del sector de {user.cluster?.toLowerCase()}. Ambas en {selected.city}.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>DATOS QUE SUSTENTAN LA RECOMENDACIÓN</p>
              {[
                ["Sector compatible", `CIIU ${selected.ciiu} - compatible con ${user.cluster}`],
                ["Ubicación", `Ambas en ${selected.city}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F0F0F0" }}>
                  <span style={{ fontSize: 13, color: "#666" }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, maxWidth: "55%", textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: "#888", textTransform: "uppercase" }}>CÓMO CONTACTAR</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F9B8E" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.67 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span style={{ fontSize: 14 }}>WhatsApp +57 —</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" small onClick={() => setSelected(null)}>Descartar</Btn>
              <Btn variant="secondary" small>Guardar</Btn>
              <Btn small onClick={() => setSelected(null)}>Aceptar conexión</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== MI CLÚSTER ====================
function MiClusterPage({ user }) {
  const cluster = CLUSTERS.find(c => c.titulo === user.cluster) || CLUSTERS[0];
  const [selectedMember, setSelectedMember] = useState(null);
  const members = [
    { initials: "CR", name: "Hotel Brisas Marinas", sub: `${cluster.titulo} · El Rodadero`, match: 92, status: "TU", connected: false },
    { initials: "HC", name: "Hotel Casa Bambú", sub: `${cluster.titulo} · El Rodadero`, match: 88, status: "CONECTADO", connected: true },
    { initials: "MA", name: user.razonSocial || "Mar Azul Boutique", sub: `${cluster.titulo} · El Rodadero`, match: 84, status: "CONECTADO", connected: true },
    { initials: "SN", name: "Hostal Sierra Nevada", sub: `${cluster.titulo} · Bavaria`, match: 81, status: "CONECTADO", connected: true },
    { initials: "PE", name: "Posada El Faro", sub: `${cluster.titulo} · Taganga`, match: 76, status: "SIN CONECTAR", connected: false },
    { initials: "CV", name: "Casa Verde del Caribe", sub: `${cluster.titulo} · El Rodadero`, match: 75, status: "SIN CONECTAR", connected: false },
    { initials: "PG", name: "La Posada de Gaira", sub: `${cluster.titulo} · Gaira`, match: 71, status: "SIN CONECTAR", connected: false },
    { initials: "AL", name: "Hotel Aluna Beach", sub: `${cluster.titulo} · El Rodadero`, match: 68, status: "SIN CONECTAR", connected: false },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem 2rem", marginBottom: 20, border: "1px solid #EAEAEA" }}>
        <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>TU CLÚSTER</p>
        <h1 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 800 }}>{cluster.titulo} en {user.municipio || "Santa Marta"}</h1>
        <p style={{ margin: "0 0 16px", fontSize: 14, color: "#666" }}>Etapa: {user.etapa}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[["MIEMBROS DEL CLÚSTER", members.length], ["CONEXIONES ACTIVAS", "3 conexiones"], ["TU CENTRALIDAD", "92%"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: cluster.bgLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cluster.color} strokeWidth="2"><circle cx="9" cy="9" r="6"/><path d="M15 15l6 6"/></svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase" }}>{k}</p>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 18 }}>{v}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "1rem 1.5rem", marginBottom: 20, border: "1px solid #EAEAEA" }}>
        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Características compartidas</p>
        <p style={{ fontSize: 12, color: "#888", margin: "0 0 12px" }}>Lo que tu clúster tiene en común y define el matching.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Negocio formal", "3-10 años operando", "Sector " + cluster.titulo, "Santa Marta", "Programa Ruta C"].map(t => (
            <span key={t} style={{ background: cluster.bgLight, color: cluster.color, border: `1px solid ${cluster.color}30`, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Members grid */}
      <h2 style={{ fontSize: 18, marginBottom: 6 }}>Miembros del clúster</h2>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>Empresas similares a la tuya en sector y etapa. Haz clic en una para ver el detalle.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {members.map(m => (
          <div key={m.initials} onClick={() => setSelectedMember(m)} style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #EAEAEA", cursor: "pointer", transition: "box-shadow .15s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <Avatar name={m.initials} size={36} color={cluster.color} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1A1A2E" }}>{m.match}%</span>
            </div>
            <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 13 }}>{m.name}</p>
            <p style={{ margin: "0 0 10px", fontSize: 11, color: "#888" }}>{m.sub}</p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              background: m.status === "TU" ? cluster.bgLight : m.connected ? "#E8F5E9" : "#F8F9FA",
              color: m.status === "TU" ? cluster.color : m.connected ? "#4CAF50" : "#888",
              borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600
            }}>
              {m.connected && "✓ "}{m.status}
            </div>
          </div>
        ))}
      </div>

      {/* Member detail modal */}
      {selectedMember && (
        <div onClick={() => setSelectedMember(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, padding: "2rem", position: "relative" }}>
            <button onClick={() => setSelectedMember(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>×</button>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
              <Avatar name={selectedMember.initials} size={56} color={cluster.color} />
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>{selectedMember.name}</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#888" }}>{selectedMember.sub}</p>
                <span style={{ display: "inline-block", marginTop: 6, background: cluster.bgLight, color: cluster.color, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>{selectedMember.match}% match</span>
              </div>
            </div>
            {selectedMember.imgs && (
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {selectedMember.imgs.map((img, i) => (
                  <img key={i} src={img} alt="" style={{ width: "50%", height: 120, objectFit: "cover", borderRadius: 10 }} />
                ))}
              </div>
            )}
            <div style={{ background: "#F8F9FA", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
              {[["Sector", cluster.titulo], ["Etapa", "Madurez"], ["Ubicación", selectedMember.sub.split("· ")[1] || "Santa Marta"], ["Estado conexión", selectedMember.status]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #EAEAEA" }}>
                  <span style={{ fontSize: 12, color: "#888" }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {!selectedMember.connected && selectedMember.status !== "TU" && (
                <Btn full onClick={() => setSelectedMember(null)}>Solicitar conexión</Btn>
              )}
              <Btn variant="secondary" full onClick={() => setSelectedMember(null)}>Cerrar</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== CONEXIONES ====================
function ConexionesPage({ user }) {
  const [selectedConn, setSelectedConn] = useState(null);
  const [connTab, setConnTab] = useState("todas");

  // Build connections based on user's cluster
  const CLUSTER_CONNECTIONS = {
    "Turismo": [
      { initials: "HC", name: "Hotel Casa Bambú", sub: "Turismo · El Rodadero", tipo: "Aliado estratégico", status: "Activa", lastInteraction: "Hoy", suggestion: "Confirma el cruce de huéspedes para el puente festivo.", messages: 5, whatsapp: "3158709001" },
      { initials: "MA", name: "Mar Azul Boutique Hotel", sub: "Turismo · El Rodadero", tipo: "Aliado estratégico", status: "Activa", lastInteraction: "Hoy", suggestion: "Coordinen paquete conjunto para temporada.", messages: 3, whatsapp: "3174567002" },
      { initials: "CT", name: "Caribe Travel Co.", sub: "Turismo · Centro Histórico", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 2 días", suggestion: "Envía cotización para grupo de 10 turistas.", messages: 2, whatsapp: "3142345001" },
      { initials: "TS", name: "Tour Sierra Nevada SAS", sub: "Turismo · Taganga", tipo: "Aliado estratégico", status: "Pendiente", lastInteraction: "Hace 6 días", suggestion: "Responde la solicitud de conexión que enviaron.", messages: 0, whatsapp: "3185678001" },
      { initials: "VT", name: "Viajes y Turismo Tayrona", sub: "Turismo · Centro", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 3 días", suggestion: "Tienen grupo de 25 personas para diciembre.", messages: 2, whatsapp: "3107890002" },
      { initials: "PE", name: "Pescadería El Mocho", sub: "Pesca · Pescaíto", tipo: "Proveedor", status: "Activa", lastInteraction: "Hace 4 días", suggestion: "Proveedor de mariscos para tu restaurante o desayunos.", messages: 1, whatsapp: "3142345678" },
      { initials: "ZM", name: "ZAKU MOCHILAS", sub: "Artesanías · Mamatoco", tipo: "Proveedor", status: "Activa", lastInteraction: "Hace 3 días", suggestion: "Souvenirs artesanales para tus huéspedes.", messages: 2, whatsapp: "3158709635" },
      { initials: "CS", name: "Café Sierra Nevada Orgánico", sub: "Café · Aracataca", tipo: "Proveedor", status: "Activa", lastInteraction: "Hace 5 días", suggestion: "Incluye su café especial en tus desayunos.", messages: 1, whatsapp: "3118901001" },
      { initials: "EX", name: "Experiencias Caribe SAS", sub: "Turismo · Bello Horizonte", tipo: "Aliado estratégico", status: "Pendiente", lastInteraction: "Hace 5 días", suggestion: "Alianza de experiencias complementarias para turistas.", messages: 0, whatsapp: "3151234001" },
      { initials: "LC", name: "Lavandería Caribe Express", sub: "Comercio · Gaira", tipo: "Proveedor", status: "Pausada", lastInteraction: "Hace 2 semanas", suggestion: "Servicio de lavandería para ropa de cama.", messages: 0, whatsapp: "3118901002" },
    ],
    "Artesanías": [
      { initials: "AB", name: "Artesanías Bahía", sub: "Artesanías · Taganga", tipo: "Aliado estratégico", status: "Activa", lastInteraction: "Ayer", suggestion: "Coordinen participación en feria de artesanos.", messages: 3, whatsapp: "3152345001" },
      { initials: "HC", name: "Hotel Casa Bambú", sub: "Turismo · El Rodadero", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 2 días", suggestion: "Ofreceles paquete de souvenirs para sus huéspedes.", messages: 2, whatsapp: "3158709001" },
      { initials: "MA", name: "Mar Azul Boutique Hotel", sub: "Turismo · El Rodadero", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 3 días", suggestion: "Boutique ideal para exhibir tus piezas artesanales.", messages: 1, whatsapp: "3174567002" },
      { initials: "CT", name: "Caribe Travel Co.", sub: "Turismo · Centro Histórico", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 4 días", suggestion: "Pueden incluir visitas a tu taller en sus tours.", messages: 2, whatsapp: "3142345001" },
      { initials: "RC", name: "Restaurante El Costeño", sub: "Comercio · El Rodadero", tipo: "Cliente potencial", status: "Pendiente", lastInteraction: "Hace 6 días", suggestion: "Decoración artesanal para su local.", messages: 0, whatsapp: "3163456001" },
      { initials: "VT", name: "Viajes y Turismo Tayrona", sub: "Turismo · Centro", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 5 días", suggestion: "Kits de souvenirs para grupos de turistas.", messages: 1, whatsapp: "3107890002" },
      { initials: "TC", name: "Transportes Caribe Norte", sub: "Logística · Mamatoco", tipo: "Proveedor", status: "Activa", lastInteraction: "Hace 1 semana", suggestion: "Logística para envío de productos a otras ciudades.", messages: 1, whatsapp: "3196789001" },
      { initials: "SN", name: "Hostal Sierra Nevada", sub: "Turismo · Bavaria", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 3 días", suggestion: "Recuerdos para sus viajeros internacionales.", messages: 2, whatsapp: "3185678002" },
      { initials: "EX", name: "Experiencias Caribe SAS", sub: "Turismo · Bello Horizonte", tipo: "Cliente potencial", status: "Pendiente", lastInteraction: "Hace 1 semana", suggestion: "Tours culturales con artesanías como protagonistas.", messages: 0, whatsapp: "3151234001" },
      { initials: "CS", name: "Café Sierra Nevada Orgánico", sub: "Café · Aracataca", tipo: "Aliado estratégico", status: "Pausada", lastInteraction: "Hace 2 semanas", suggestion: "Alianza de productos locales auténticos del Magdalena.", messages: 0, whatsapp: "3118901001" },
    ],
    "Banano": [
      { initials: "AG", name: "Agro Guamal SAS", sub: "Banano · Guamal", tipo: "Aliado estratégico", status: "Activa", lastInteraction: "Hace 2 días", suggestion: "Intercambio de buenas prácticas agrícolas.", messages: 2, whatsapp: "3196789002" },
      { initials: "TC", name: "Transportes Caribe Norte", sub: "Logística · Mamatoco", tipo: "Proveedor", status: "Activa", lastInteraction: "Hoy", suggestion: "Logística refrigerada para exportación de fruta.", messages: 4, whatsapp: "3196789001" },
      { initials: "FP", name: "Finca La Primavera", sub: "Palma · Zona Bananera", tipo: "Aliado estratégico", status: "Activa", lastInteraction: "Hace 3 días", suggestion: "Vecinos en la Zona Bananera, posible maquinaria compartida.", messages: 1, whatsapp: "3129012001" },
      { initials: "DD", name: "Distribuidora Del Mar", sub: "Pesca · Pescaíto", tipo: "Referente", status: "Pendiente", lastInteraction: "Hace 1 semana", suggestion: "Canal de distribución local alternativo.", messages: 0, whatsapp: "3140123001" },
      { initials: "RC", name: "Restaurante El Costeño", sub: "Comercio · El Rodadero", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 4 días", suggestion: "Comprador de patacones y plátano maduro.", messages: 2, whatsapp: "3163456001" },
    ],
    "Logística": [
      { initials: "BG", name: "Bananera González & Hijos", sub: "Banano · Zona Bananera", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hoy", suggestion: "Gran volumen de exportación que requiere logística.", messages: 4, whatsapp: "3174567001" },
      { initials: "FP", name: "Finca La Primavera", sub: "Palma · Zona Bananera", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 2 días", suggestion: "Transporte de racimos a extractoras.", messages: 2, whatsapp: "3129012001" },
      { initials: "DD", name: "Distribuidora Del Mar", sub: "Pesca · Pescaíto", tipo: "Aliado estratégico", status: "Activa", lastInteraction: "Ayer", suggestion: "Cadena de frío compartida para distribución.", messages: 3, whatsapp: "3140123001" },
      { initials: "AG", name: "Agro Guamal SAS", sub: "Banano · Guamal", tipo: "Cliente potencial", status: "Pendiente", lastInteraction: "Hace 6 días", suggestion: "Necesitan transporte desde Guamal al puerto.", messages: 0, whatsapp: "3196789002" },
      { initials: "CS", name: "Café Sierra Nevada Orgánico", sub: "Café · Aracataca", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 5 días", suggestion: "Transporte del café desde la sierra al punto de venta.", messages: 1, whatsapp: "3118901001" },
    ],
    "Palma de Aceite": [
      { initials: "FP", name: "Finca La Primavera", sub: "Palma · Zona Bananera", tipo: "Aliado estratégico", status: "Activa", lastInteraction: "Ayer", suggestion: "Intercambio de técnicas de cultivo sostenible.", messages: 3, whatsapp: "3129012001" },
      { initials: "TC", name: "Transportes Caribe Norte", sub: "Logística · Mamatoco", tipo: "Proveedor", status: "Activa", lastInteraction: "Hace 2 días", suggestion: "Transporte de RFF a la extractora más cercana.", messages: 2, whatsapp: "3196789001" },
      { initials: "AG", name: "Agro Guamal SAS", sub: "Banano · Guamal", tipo: "Referente", status: "Activa", lastInteraction: "Hace 4 días", suggestion: "Experiencia en certificaciones agrícolas.", messages: 1, whatsapp: "3196789002" },
      { initials: "BG", name: "Bananera González & Hijos", sub: "Banano · Zona Bananera", tipo: "Referente", status: "Pendiente", lastInteraction: "Hace 1 semana", suggestion: "Certificación Rainforest Alliance que podría aplicar.", messages: 0, whatsapp: "3174567001" },
    ],
    "Pesca y Acuicultura": [
      { initials: "DD", name: "Distribuidora Del Mar", sub: "Pesca · Pescaíto", tipo: "Aliado estratégico", status: "Activa", lastInteraction: "Hoy", suggestion: "Distribuyan juntos para cubrir más restaurantes.", messages: 4, whatsapp: "3140123001" },
      { initials: "RC", name: "Restaurante El Costeño", sub: "Comercio · El Rodadero", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Ayer", suggestion: "Su carta de mariscos requiere proveeduría constante.", messages: 3, whatsapp: "3163456001" },
      { initials: "HC", name: "Hotel Casa Bambú", sub: "Turismo · El Rodadero", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 2 días", suggestion: "Restaurante del hotel necesita mariscos frescos diarios.", messages: 2, whatsapp: "3158709001" },
      { initials: "TC", name: "Transportes Caribe Norte", sub: "Logística · Mamatoco", tipo: "Proveedor", status: "Activa", lastInteraction: "Hace 3 días", suggestion: "Transporte refrigerado para distribución.", messages: 1, whatsapp: "3196789001" },
      { initials: "MA", name: "Mar Azul Boutique Hotel", sub: "Turismo · El Rodadero", tipo: "Cliente potencial", status: "Pendiente", lastInteraction: "Hace 1 semana", suggestion: "Pide cotización para suministro semanal.", messages: 0, whatsapp: "3174567002" },
    ],
    "Café": [
      { initials: "CS2", name: "Coffi Sierra Café SAS", sub: "Café · Santa Marta", tipo: "Aliado estratégico", status: "Activa", lastInteraction: "Ayer", suggestion: "Co-branding de cafés especiales de la Sierra Nevada.", messages: 3, whatsapp: "3118901010" },
      { initials: "TC", name: "Transportes Caribe Norte", sub: "Logística · Mamatoco", tipo: "Proveedor", status: "Activa", lastInteraction: "Hace 3 días", suggestion: "Transporte del café desde la finca al punto de venta.", messages: 2, whatsapp: "3196789001" },
      { initials: "HC", name: "Hotel Casa Bambú", sub: "Turismo · El Rodadero", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 4 días", suggestion: "Desayunos con café especial de la Sierra para turistas.", messages: 1, whatsapp: "3158709001" },
      { initials: "SN", name: "Hostal Sierra Nevada", sub: "Turismo · Bavaria", tipo: "Cliente potencial", status: "Pendiente", lastInteraction: "Hace 1 semana", suggestion: "Café de bienvenida para viajeros internacionales.", messages: 0, whatsapp: "3185678002" },
      { initials: "RC", name: "Restaurante El Costeño", sub: "Comercio · El Rodadero", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 5 días", suggestion: "Carta de cafés especiales en su menú.", messages: 2, whatsapp: "3163456001" },
    ],
    "Comercio y Servicios": [
      { initials: "HC", name: "Hotel Casa Bambú", sub: "Turismo · El Rodadero", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hoy", suggestion: "Gran volumen de compras en insumos y servicios.", messages: 3, whatsapp: "3158709001" },
      { initials: "MA", name: "Mar Azul Boutique Hotel", sub: "Turismo · El Rodadero", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 2 días", suggestion: "Proveeduría regular para hotel boutique.", messages: 2, whatsapp: "3174567002" },
      { initials: "TC", name: "Transportes Caribe Norte", sub: "Logística · Mamatoco", tipo: "Proveedor", status: "Activa", lastInteraction: "Hace 3 días", suggestion: "Logística para tus productos o servicios.", messages: 1, whatsapp: "3196789001" },
      { initials: "EX", name: "Experiencias Caribe SAS", sub: "Turismo · Bello Horizonte", tipo: "Aliado estratégico", status: "Pendiente", lastInteraction: "Hace 1 semana", suggestion: "Alianza para ofrecer servicios a turistas.", messages: 0, whatsapp: "3151234001" },
      { initials: "ZM", name: "ZAKU MOCHILAS", sub: "Artesanías · Mamatoco", tipo: "Aliado estratégico", status: "Activa", lastInteraction: "Hace 4 días", suggestion: "Proveedor de productos locales para tu negocio.", messages: 1, whatsapp: "3158709635" },
    ],
  };
  const defaultConns = [
    { initials: "TC", name: "Transportes Caribe Norte", sub: "Logística · Mamatoco", tipo: "Proveedor", status: "Activa", lastInteraction: "Hace 2 días", suggestion: "Logística para tu negocio.", messages: 1, whatsapp: "3196789001" },
    { initials: "RC", name: "Restaurante El Costeño", sub: "Comercio · El Rodadero", tipo: "Cliente potencial", status: "Activa", lastInteraction: "Hace 3 días", suggestion: "Posible cliente para tus productos.", messages: 1, whatsapp: "3163456001" },
    { initials: "HC", name: "Hotel Casa Bambú", sub: "Turismo · El Rodadero", tipo: "Aliado estratégico", status: "Pendiente", lastInteraction: "Hace 1 semana", suggestion: "Alianza potencial para crecer en Santa Marta.", messages: 0, whatsapp: "3158709001" },
  ];
  const [connections, setConnections] = useState(CLUSTER_CONNECTIONS[user?.cluster] || defaultConns);


  const stats = [
    { val: connections.filter(c => c.status === "Activa").length, label: "Activas", color: "#4CAF50" },
    { val: connections.filter(c => c.status === "Pendiente").length, label: "Pendientes", color: "#FF9800" },
    { val: connections.filter(c => c.status === "Pausada").length, label: "En pausa", color: "#9E9E9E" },
    { val: connections.filter(c => c.status === "Archivada").length, label: "Archivadas", color: "#607D8B" },
  ];

  const tipoColor = { "Aliado estratégico": "#0F9B8E", "Cliente potencial": "#185FA5", "Proveedor": "#BA7517" };

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Mis conexiones</h1>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>{connections.length} negocios en tu red · mostrando {connTab === "todas" ? connections.length : connections.filter(c => c.status === connTab).length}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...base.card, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2"><circle cx="9" cy="9" r="6"/><path d="M19 19l-6-6"/></svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{s.val}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { label: "Todas", filter: "todas" },
          { label: `Activas ${connections.filter(c => c.status === "Activa").length}`, filter: "Activa" },
          { label: `Pendientes ${connections.filter(c => c.status === "Pendiente").length}`, filter: "Pendiente" },
          { label: `En pausa ${connections.filter(c => c.status === "Pausada").length}`, filter: "Pausada" },
          { label: "Archivadas", filter: "Archivada" },
        ].map(t => {
          const active = connTab === t.filter;
          return (
            <button key={t.filter} onClick={() => setConnTab(t.filter)} style={{
              background: active ? "#0F9B8E" : "#fff",
              color: active ? "#fff" : "#555",
              border: "1.5px solid", borderColor: active ? "#0F9B8E" : "#D8DDE5",
              borderRadius: 20, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: base.fontFamily, fontWeight: active ? 600 : 400
            }}>{t.label}</button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {connections.filter(c => connTab === "todas" || c.status === connTab).map(c => (
          <div key={c.initials} style={{ background: "#fff", borderRadius: 14, padding: "1.25rem 1.5rem", border: "1px solid #EAEAEA" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Avatar name={c.initials} size={40} color={tipoColor[c.tipo] || "#0F9B8E"} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 15 }}>{c.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{c.sub}</p>
                  </div>
                  <span style={{ fontSize: 12, color: "#888" }}>Última interacción: {c.lastInteraction}</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <Badge color={tipoColor[c.tipo] || "#0F9B8E"}>{c.tipo}</Badge>
                  <Badge color={c.status === "Activa" ? "#4CAF50" : "#FF9800"}>{c.status}</Badge>
                </div>
                {c.suggestion && (
                  <div style={{ background: "#F0FBF9", borderRadius: 8, padding: "8px 12px", marginTop: 10, fontSize: 13, color: "#555" }}>
                    <span style={{ fontWeight: 600, color: "#0F9B8E" }}>El Conector sugiere: </span>{c.suggestion}
                  </div>
                )}
                {c.messages > 0 && <p style={{ fontSize: 12, color: "#888", marginTop: 6, marginBottom: 0 }}>{c.messages} mensajes intercambiados esta semana</p>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <Btn variant="secondary" small onClick={() => window.open(`https://wa.me/57${c.whatsapp || "3000000000"}`, "_blank")}>WhatsApp</Btn>
              <Btn variant="ghost" small onClick={() => {
                const idx = connections.indexOf(c);
                const updated = [...connections];
                updated[idx] = { ...c, status: c.status === "Activa" ? "Pausada" : "Activa" };
                setConnections(updated);
              }}>{c.status === "Activa" ? "Pausar" : "Reactivar"}</Btn>
              <span onClick={() => setSelectedConn(c)} style={{ marginLeft: "auto", fontSize: 13, color: "#0F9B8E", cursor: "pointer", fontWeight: 600, alignSelf: "center" }}>Ver detalle →</span>
            </div>
          </div>
        ))}
      </div>
      {/* Connection detail modal */}
      {selectedConn && (
        <div onClick={() => setSelectedConn(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "flex-end", zIndex: 200 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", width: 420, height: "100%", overflowY: "auto", padding: "1.5rem", position: "relative" }}>
            <button onClick={() => setSelectedConn(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>×</button>

            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
              <Avatar name={selectedConn.initials} size={52} color={tipoColor[selectedConn.tipo] || "#0F9B8E"} />
              <div>
                <h2 style={{ margin: "0 0 2px", fontSize: 18 }}>{selectedConn.name}</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#888" }}>{selectedConn.sub}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <Badge color={tipoColor[selectedConn.tipo] || "#0F9B8E"}>{selectedConn.tipo}</Badge>
              <Badge color={selectedConn.status === "Activa" ? "#4CAF50" : "#FF9800"}>{selectedConn.status}</Badge>
            </div>

            <div style={{ background: "#F8F9FA", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
              {[
                ["Última interacción", selectedConn.lastInteraction],
                ["Mensajes esta semana", selectedConn.messages + " mensajes"],
                ["Tipo de relación", selectedConn.tipo],
                ["Estado", selectedConn.status],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #EAEAEA" }}>
                  <span style={{ fontSize: 12, color: "#888" }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>

            {selectedConn.suggestion && (
              <div style={{ background: "#F0FBF9", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#0F9B8E", fontSize: 13 }}>El Conector sugiere:</p>
                <p style={{ margin: 0, fontSize: 13, color: "#555" }}>{selectedConn.suggestion}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn onClick={() => window.open(`https://wa.me/57${selectedConn.whatsapp}`, "_blank")}>WhatsApp</Btn>
              <Btn variant="ghost" onClick={() => {
                setConnections(prev => prev.map(c => c.initials === selectedConn.initials ? { ...c, status: c.status === "Activa" ? "Pausada" : "Activa" } : c));
                setSelectedConn(null);
              }}>{selectedConn.status === "Activa" ? "Pausar conexión" : "Reactivar"}</Btn>
              <Btn variant="danger" onClick={() => {
                setConnections(prev => prev.filter(c => c.initials !== selectedConn.initials));
                setSelectedConn(null);
              }}>Archivar</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PRODUCTOS TAB ====================
function ProductosTab({ user, onUpdate }) {
  const [productos, setProductos] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rutac_productos_" + user?.id) || "[]"); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "", imageUrl: "" });
  const [preview, setPreview] = useState(null);

  const saveProductos = (list) => {
    setProductos(list);
    localStorage.setItem("rutac_productos_" + user?.id, JSON.stringify(list));
    // Notify marketplace to refresh immediately
    window.dispatchEvent(new Event("storage"));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setForm(f => ({ ...f, imageUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const addProducto = () => {
    if (!form.nombre.trim()) return;
    const nuevo = { ...form, id: Date.now(), imageUrl: preview || form.imageUrl };
    saveProductos([...productos, nuevo]);
    setForm({ nombre: "", descripcion: "", precio: "", imageUrl: "" });
    setPreview(null);
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>Mis productos y servicios</h3>
          <p style={{ margin: 0, fontSize: 13, color: "#666" }}>Agrega fotos de tus productos para que aparezcan en recomendaciones y marketplace</p>
        </div>
        <Btn small onClick={() => setShowForm(true)}>+ Agregar</Btn>
      </div>

      {showForm && (
        <div style={{ background: "#F8F9FA", borderRadius: 12, padding: "1.5rem", marginBottom: 20, border: "1px solid #E0E0E0" }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 15 }}>Nuevo producto / servicio</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={base.label}>Nombre *</label>
              <input value={form.nombre} onChange={e => setForm(f => ({...f, nombre: e.target.value}))} placeholder="Mochila Wayuu artesanal" style={base.input} />
            </div>
            <div>
              <label style={base.label}>Precio (opcional)</label>
              <input value={form.precio} onChange={e => setForm(f => ({...f, precio: e.target.value}))} placeholder="Desde $150.000 COP" style={base.input} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={base.label}>Descripción</label>
            <textarea value={form.descripcion} onChange={e => setForm(f => ({...f, descripcion: e.target.value}))} placeholder="Describe el producto o servicio..." style={{ ...base.input, minHeight: 80, resize: "vertical" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={base.label}>Foto del producto</label>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: 13 }} />
            {preview && <img src={preview} alt="" style={{ marginTop: 10, width: 160, height: 110, objectFit: "cover", borderRadius: 8 }} />}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={addProducto} disabled={!form.nombre.trim()}>Guardar producto</Btn>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setPreview(null); }}>Cancelar</Btn>
          </div>
        </div>
      )}

      {productos.length === 0 && !showForm && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#888", background: "#F8F9FA", borderRadius: 12 }}>
          <p style={{ fontSize: 15, marginBottom: 12 }}>Aún no has agregado productos o servicios.</p>
          <Btn small onClick={() => setShowForm(true)}>Agregar mi primer producto</Btn>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 16 }}>
        {productos.map(p => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #EAEAEA", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            {p.imageUrl
              ? <img src={p.imageUrl} alt="" style={{ width: "100%", height: 160, objectFit: "cover" }} />
              : <div style={{ width: "100%", height: 160, background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: 13 }}>Sin foto</div>
            }
            <div style={{ padding: "12px 14px" }}>
              <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14 }}>{p.nombre}</p>
              {p.precio && <p style={{ margin: "0 0 4px", fontSize: 13, color: "#0F9B8E", fontWeight: 600 }}>{p.precio}</p>}
              {p.descripcion && <p style={{ margin: 0, fontSize: 12, color: "#666" }}>{p.descripcion}</p>}
              <button onClick={() => saveProductos(productos.filter(x => x.id !== p.id))} style={{ marginTop: 8, background: "none", border: "none", color: "#D85A30", fontSize: 12, cursor: "pointer", fontFamily: base.fontFamily }}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== MI NEGOCIO (PERFIL EDITABLE) ====================
function MiNegocioPage({ user, setUserGlobal }) {
  const [tab, setTab] = useState("General");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => ({
    ...user,
    // Normalize snake_case → camelCase from Supabase
    razonSocial: user.razonSocial || user.razon_social || "",
    municipio: user.municipio?.trim() || "Santa Marta",
    barrio: user.barrio?.trim() || "",
    cluster: user.cluster || "",
    etapa: user.etapa || "Inicio",
    whatsapp: user.whatsapp || "",
    descripcion: user.descripcion || "",
    tiempoOperando: user.tiempoOperando || user.tiempo_operando || "",
    nit: user.nit || "",
    completitud: user.completitud || 70,
  }));
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.razonSocial?.trim()) e.razonSocial = "Obligatorio";
    if (form.whatsapp && !/^\d{10}$/.test(form.whatsapp)) e.whatsapp = "10 dígitos";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaved(false);

    // Get real user ID from Supabase session if not in user object
    let userId = user.id;
    if (!userId || userId === "undefined") {
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id;
    }
    if (!userId) {
      alert("Error: no se pudo identificar tu cuenta. Recarga la página.");
      return;
    }

    const payload = {
      razon_social: form.razonSocial || form.razon_social || "",
      cluster: form.cluster || "",
      etapa: form.etapa || "Inicio",
      municipio: form.municipio || "",
      barrio: form.barrio || "",
      whatsapp: form.whatsapp || "",
      descripcion: form.descripcion || "",
      tiempo_operando: form.tiempoOperando || form.tiempo_operando || "",
      nit: form.nit || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("perfiles")
      .update(payload)
      .eq("id", userId);

    if (error) {
      console.error("Error guardando perfil:", error.message);
      alert("Error al guardar: " + error.message);
      return;
    }

    const updated = {
      ...user,
      ...form,
      ...payload,
      id: userId,
      razonSocial: payload.razon_social,
      razon_social: payload.razon_social,
      tiempoOperando: payload.tiempo_operando,
    };
    saveCurrent(updated);
    setUserGlobal(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  const completitud = user.completitud || 70;

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      {/* Header card */}
      <div style={{ ...base.card, display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 20 }}>
        <Avatar name={user.razonSocial} size={60} color={clusterColor(user.cluster)} />
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 22 }}>{user.razonSocial}</h1>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "#888" }}>{user.cluster} · {user.etapa} · {user.municipio}</p>
          <div style={{ display: "flex", gap: 10 }}>
            {!editing && <Btn small onClick={() => setEditing(true)}>Editar perfil</Btn>}
            {editing && <><Btn small onClick={save}>Guardar cambios</Btn><Btn variant="ghost" small onClick={() => { setEditing(false); setForm({ ...user, razonSocial: user.razonSocial || user.razon_social || "", municipio: user.municipio || "", barrio: user.barrio || "", tiempoOperando: user.tiempoOperando || user.tiempo_operando || "" }); }}>Cancelar</Btn></>}
          </div>
          {saved && <p style={{ color: "#0F9B8E", fontSize: 13, marginTop: 8, fontWeight: 600 }}>Cambios guardados correctamente.</p>}
        </div>
        <div style={{ textAlign: "right" }}>
          {[["Completitud del perfil", completitud + "%"], ["Empresas que te recomiendan", "4"], ["Empresas que guardaron tu perfil", "7"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, justifyContent: "flex-end" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{k}</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, borderBottom: "2px solid #EAEAEA", marginBottom: 20 }}>
        {["General", "Productos y servicios", "Programas", "Visibilidad"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: "none", border: "none", padding: "10px 18px",
            fontWeight: tab === t ? 600 : 400, color: tab === t ? "#0F9B8E" : "#555",
            borderBottom: tab === t ? "2px solid #0F9B8E" : "2px solid transparent",
            cursor: "pointer", fontSize: 14, fontFamily: base.fontFamily, marginBottom: -2
          }}>{t}</button>
        ))}
      </div>

      {tab === "General" && (
        <div style={{ ...base.card }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16 }}>Datos del negocio</h3>
          {editing ? (
            <div style={{ display: "grid", gap: 14 }}>
              <Field label="Nombre / Razón Social *" error={errors.razonSocial}>
                <input value={form.razonSocial || ""} onChange={e => update("razonSocial", e.target.value)} style={errors.razonSocial ? base.inputError : base.input} />
              </Field>
              <Field label="NIT" error={errors.nit}>
                <input value={form.nit || ""} onChange={e => update("nit", e.target.value.replace(/[^0-9\-]/g, ""))} placeholder="800170340-1" style={errors.nit ? base.inputError : base.input} />
                <span style={{ fontSize: 12, color: "#888" }}>Número de Identificación Tributaria (opcional si eres informal)</span>
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Clúster / Sector">
                  <select value={form.cluster || ""} onChange={e => update("cluster", e.target.value)} style={base.input}>
                    {CLUSTERS.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}
                  </select>
                </Field>
                <Field label="Etapa empresarial">
                  <select value={form.etapa || ""} onChange={e => update("etapa", e.target.value)} style={base.input}>
                    {ETAPAS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Municipio">
                  <select value={form.municipio || "Santa Marta"} onChange={e => { update("municipio", e.target.value); update("barrio", ""); }} style={base.input}>
                    {MUNICIPIOS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Barrio o vereda">
                  <select
                    value={form.barrio || ""}
                    onChange={e => update("barrio", e.target.value)}
                    style={base.input}
                  >
                    <option value="">Selecciona un barrio</option>
                    {(MUNICIPIOS_BARRIOS[form.municipio] || MUNICIPIOS_BARRIOS["Santa Marta"]).map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="WhatsApp (10 dígitos)" error={errors.whatsapp}>
                <input value={form.whatsapp || ""} maxLength={10} onChange={e => update("whatsapp", e.target.value.replace(/\D/g, ""))} style={errors.whatsapp ? base.inputError : base.input} placeholder="3158709635" />
              </Field>
              <Field label="Tiempo operando">
                <select value={form.tiempoOperando || ""} onChange={e => update("tiempoOperando", e.target.value)} style={base.input}>
                  <option value="">Selecciona</option>
                  {TIEMPOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Descripción del negocio">
                <textarea value={form.descripcion || ""} onChange={e => update("descripcion", e.target.value)} maxLength={280} style={{ ...base.input, minHeight: 100, resize: "vertical" }} placeholder="Describe qué hace tu negocio..." />
              </Field>
            </div>
          ) : (
            <div>
              {[
                ["NOMBRE", user.razonSocial || user.razon_social],
                ["NIT", user.nit || "—"],
                ["SECTOR", user.cluster],
                ["ETAPA", user.etapa],
                ["TIEMPO OPERANDO", user.tiempoOperando || user.tiempo_operando],
                ["MUNICIPIO", user.municipio],
                ["BARRIO", user.barrio],
                ["WHATSAPP", user.whatsapp ? `+57 ${user.whatsapp}` : "—"],
                ["DESCRIPCIÓN", user.descripcion || "Sin descripción"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 20, padding: "10px 0", borderBottom: "1px solid #F5F5F5" }}>
                  <span style={{ fontSize: 12, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, minWidth: 140 }}>{k}</span>
                  <span style={{ fontSize: 14, color: "#1A1A2E" }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "Productos y servicios" && (
        <ProductosTab user={user} onUpdate={setUserGlobal} />
      )}

      {tab === "Programas" && (
        <div style={{ ...base.card }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Programas de la Cámara de Comercio</h3>
          {[
            { nombre: "Mujeres Productivas", desc: "Programa de apoyo y financiamiento para mujeres emprendedoras del Magdalena.", estado: "Disponible", color: "#9C27B0" },
            { nombre: "Ruta al Mercado", desc: "Conecta tu negocio con compradores institucionales y canales de distribución.", estado: "Disponible", color: "#0F9B8E" },
            { nombre: "Formalización Express", desc: "Asistencia gratuita para formalizar tu negocio en menos de 5 días.", estado: "Activo", color: "#4CAF50" },
          ].map(p => (
            <div key={p.nombre} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #F5F5F5" }}>
              <div>
                <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14 }}>{p.nombre}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#666" }}>{p.desc}</p>
              </div>
              <span style={{ background: p.color + "18", color: p.color, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", marginLeft: 16 }}>{p.estado}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "Visibilidad" && (
        <div style={{ ...base.card }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Configuración de visibilidad</h3>
          {[
            ["Aparecer en búsquedas del Marketplace", true],
            ["Recibir solicitudes de conexión", true],
            ["Mostrar WhatsApp en mi perfil público", true],
            ["Permitir que me recomienden a otros", true],
          ].map(([label, defaultVal]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F5F5F5" }}>
              <span style={{ fontSize: 14, color: "#333" }}>{label}</span>
              <div style={{ width: 44, height: 24, borderRadius: 12, background: defaultVal ? "#0F9B8E" : "#ddd", position: "relative", cursor: "pointer" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: defaultVal ? 22 : 2, transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== MARKETPLACE ====================
function MarketplacePage({ user, allProfiles }) {
  const [search, setSearch] = useState("");
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [productosMap, setProductosMap] = useState({});

  // Load productos from localStorage - refresh every 2s to pick up new products
  const refreshProductos = useCallback(() => {
    const p = {};
    (allProfiles || []).forEach(prof => {
      try {
        const items = JSON.parse(localStorage.getItem("rutac_productos_" + prof.id) || "[]");
        if (items.length) p[prof.id] = items;
      } catch {}
    });
    // Also load own products
    try {
      const own = JSON.parse(localStorage.getItem("rutac_productos_" + user.id) || "[]");
      if (own.length) p[user.id] = own;
    } catch {}
    setProductosMap(p);
  }, [allProfiles, user.id]);

  useEffect(() => {
    refreshProductos();
    // Listen for storage changes from other tabs / same tab saves
    const handler = () => refreshProductos();
    window.addEventListener("storage", handler);
    // Also poll every 1.5s for same-tab saves
    const interval = setInterval(refreshProductos, 1500);
    return () => { window.removeEventListener("storage", handler); clearInterval(interval); };
  }, [refreshProductos]);

  // ---- STATIC CURATED PRODUCTS (always visible, cluster-tagged) ----
  const STATIC_PRODUCTS = [
    { id: "s1",  cluster: "Artesanías",         nombre: "Mochila Wayuu Grande",             empresa: "ZAKU MOCHILAS",              municipio: "Santa Marta",   etapa: "Madurez",        whatsapp: "3158709635", precio: "$220.000",  desc: "Mochila 100% artesanal tejida a mano por mujeres wayuu. Diseños exclusivos en colores vibrantes del Caribe. 40×35 cm. Entrega en 5 días.", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=280&fit=crop" },
    { id: "s2",  cluster: "Artesanías",         nombre: "Set Aretes de Conchas",            empresa: "Artesanías Bahía",           municipio: "Taganga",       etapa: "Consolidación",  whatsapp: "3152345001", precio: "$45.000",   desc: "Aretes elaborados con conchas del Caribe colombiano y semillas naturales. Pieza única certificada. Incluye estuche de regalo.", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=280&fit=crop" },
    { id: "s3",  cluster: "Artesanías",         nombre: "Sombrero Vueltiao",                empresa: "Artesanías Bahía",           municipio: "Taganga",       etapa: "Consolidación",  whatsapp: "3152345001", precio: "$85.000",   desc: "Sombrero vueltiao tejido en fibra de caña flecha. Símbolo cultural del Caribe. Tallas S/M/L.", img: "https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=400&h=280&fit=crop" },
    { id: "s4",  cluster: "Turismo",            nombre: "Tour Parque Tayrona 1 día",        empresa: "Tour Sierra Nevada SAS",     municipio: "Santa Marta",   etapa: "Crecimiento",    whatsapp: "3185678001", precio: "$150.000/persona", desc: "Transporte + guía bilingüe + seguro + snack. Máx. 12 personas. Salida 7am.", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&fit=crop" },
    { id: "s5",  cluster: "Turismo",            nombre: "Noche Hotel Boutique",             empresa: "Hotel Casa Bambú",           municipio: "Santa Marta",   etapa: "Madurez",        whatsapp: "3158709001", precio: "Desde $280.000/noche", desc: "Habitación doble frente al mar. Desayuno incluido, WiFi, piscina.", img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=280&fit=crop" },
    { id: "s6",  cluster: "Turismo",            nombre: "Clase de Cocina Caribeña",         empresa: "Experiencias Caribe SAS",    municipio: "Santa Marta",   etapa: "Crecimiento",    whatsapp: "3151234001", precio: "$80.000/persona", desc: "Aprende sancocho de pescado, arroz con coco y patacones con chef local. Grupos 4-12.", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=280&fit=crop" },
    { id: "s7",  cluster: "Pesca y Acuicultura",nombre: "Pargo Rojo Fresco x kg",           empresa: "Pescadería El Mocho",        municipio: "Santa Marta",   etapa: "Crecimiento",    whatsapp: "3142345678", precio: "$25.000/kg",  desc: "Pargo rojo directo del muelle de Pescaíto. Mín. 2 kg. Entrega antes 9am.", img: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&h=280&fit=crop" },
    { id: "s8",  cluster: "Pesca y Acuicultura",nombre: "Caja Mariscos Mixtos 5 kg",        empresa: "Distribuidora Del Mar",      municipio: "Santa Marta",   etapa: "Consolidación",  whatsapp: "3140123001", precio: "$180.000/caja", desc: "5 kg: camarón tigre, calamar, mejillones y pulpo. Cadena de frío. Pago contraentrega.", img: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=280&fit=crop" },
    { id: "s9",  cluster: "Café",               nombre: "Café Especial 500g",               empresa: "Café Sierra Nevada Orgánico",municipio: "Aracataca",     etapa: "Inicio",         whatsapp: "3118901001", precio: "$45.000/500g",desc: "Orgánico de altura, variedad Caturra. Tostado medio. Notas de frutos rojos. 85 puntos Q-Grader.", img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=280&fit=crop" },
    { id: "s10", cluster: "Banano",             nombre: "Plátano Macho x racimo",           empresa: "Bananera González & Hijos",  municipio: "Zona Bananera", etapa: "Consolidación",  whatsapp: "3174567001", precio: "$12.000/racimo", desc: "Primera calidad de la Zona Bananera. Racimos 20-25 unidades. Venta mayorista.", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=280&fit=crop" },
    { id: "s11", cluster: "Logística",          nombre: "Flete Santa Marta–Bogotá",         empresa: "Transportes Caribe Norte",   municipio: "Santa Marta",   etapa: "Consolidación",  whatsapp: "3196789001", precio: "Desde $380.000/viaje", desc: "Furgón 1.5 ton. Rastreo GPS, seguro incluido. 18-20 horas. Recogida en bodega.", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=280&fit=crop" },
    { id: "s12", cluster: "Comercio y Servicios",nombre: "Almuerzo Ejecutivo Caribeño",     empresa: "Restaurante El Costeño",     municipio: "Santa Marta",   etapa: "Consolidación",  whatsapp: "3163456001", precio: "$25.000/persona", desc: "Sopa + plato + jugo + postre. Eventos corporativos hasta 80 personas.", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=280&fit=crop" },
    { id: "s13", cluster: "Comercio y Servicios",nombre: "Lavandería Industrial x kg",      empresa: "Lavandería Caribe Express",  municipio: "Santa Marta",   etapa: "Madurez",        whatsapp: "3118901002", precio: "$4.500/kg",   desc: "Lavado y planchado industrial para hoteles y restaurantes. Recogida y entrega 24h.", img: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=280&fit=crop" },
    { id: "s14", cluster: "Palma de Aceite",    nombre: "Aceite de Palma Bruto x litro",   empresa: "Palmeras del Magdalena SAS", municipio: "El Retén",      etapa: "Crecimiento",    whatsapp: "3107890001", precio: "$5.800/litro","desc": "CPO cero deforestación. Para procesadoras de alimentos. Mín. 1.000 L. RSPO.", img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=280&fit=crop" },
    { id: "s15", cluster: "Turismo",            nombre: "Paquete Luna de Miel 3N",          empresa: "Mar Azul Boutique Hotel",    municipio: "Santa Marta",   etapa: "Madurez",        whatsapp: "3174567002", precio: "$1.200.000/pareja", desc: "Jacuzzi, cena romántica, desayuno en cama, spa y tour privado Tayrona.", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=280&fit=crop" },
  ];

  // ---- REAL PROFILE PRODUCTS (from Supabase users who added products) ----
  const realListings = [];
  (allProfiles || []).filter(p => p.id !== user.id && p.role !== 'admin').forEach(prof => {
    const prods = productosMap[prof.id] || [];
    prods.forEach((prod, idx) => {
      realListings.push({
        id: `r_${prof.id}_${idx}`,
        cluster: prof.cluster || "Comercio y Servicios",
        nombre: prod.nombre,
        empresa: prof.razon_social,
        municipio: prof.municipio,
        etapa: prof.etapa,
        whatsapp: prof.whatsapp,
        precio: prod.precio || "Consultar precio",
        desc: prod.descripcion || `Producto ofrecido por ${prof.razon_social}. Contacta para más información.`,
        img: prod.imageUrl || (() => {
          // Generate themed Unsplash image based on product name keywords
          const kw = (prod.nombre || "").toLowerCase();
          if (kw.includes("mochila") || kw.includes("wayuu") || kw.includes("arhuaca")) return "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=280&fit=crop";
          if (kw.includes("café") || kw.includes("cafe") || kw.includes("coffee")) return "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=280&fit=crop";
          if (kw.includes("pesca") || kw.includes("pescado") || kw.includes("mariscos") || kw.includes("pargo") || kw.includes("camarón")) return "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&h=280&fit=crop";
          if (kw.includes("artesanía") || kw.includes("artesania") || kw.includes("joyería") || kw.includes("bisutería")) return "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=280&fit=crop";
          if (kw.includes("hotel") || kw.includes("hospedaje") || kw.includes("hostal") || kw.includes("alojamiento")) return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=280&fit=crop";
          if (kw.includes("tour") || kw.includes("viaje") || kw.includes("turismo") || kw.includes("excursión") || kw.includes("excursion")) return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&fit=crop";
          if (kw.includes("plátano") || kw.includes("platano") || kw.includes("banano") || kw.includes("fruta")) return "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=280&fit=crop";
          if (kw.includes("comida") || kw.includes("almuerzo") || kw.includes("restaurante") || kw.includes("gastro")) return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=280&fit=crop";
          if (kw.includes("transporte") || kw.includes("flete") || kw.includes("logística") || kw.includes("envío")) return "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=280&fit=crop";
          if (kw.includes("palma") || kw.includes("aceite")) return "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=280&fit=crop";
          if (kw.includes("ropa") || kw.includes("vestido") || kw.includes("camisa") || kw.includes("moda")) return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=280&fit=crop";
          if (kw.includes("flor") || kw.includes("planta") || kw.includes("jardín") || kw.includes("botanica")) return "https://images.unsplash.com/photo-1490750967868-88df5691cc76?w=400&h=280&fit=crop";
          if (kw.includes("limpieza") || kw.includes("aseo") || kw.includes("lavandería") || kw.includes("lavanderia")) return "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=280&fit=crop";
          if (kw.includes("sombrero") || kw.includes("bisutería") || kw.includes("accesorio")) return "https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=400&h=280&fit=crop";
          if (kw.includes("tecnología") || kw.includes("tecnologia") || kw.includes("digital") || kw.includes("software")) return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=280&fit=crop";
          // Cluster-based fallback
          const cl = (prof.cluster || "").toLowerCase();
          if (cl.includes("turismo")) return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&fit=crop";
          if (cl.includes("artesanía") || cl.includes("artesania")) return "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=280&fit=crop";
          if (cl.includes("pesca")) return "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&h=280&fit=crop";
          if (cl.includes("café") || cl.includes("cafe")) return "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=280&fit=crop";
          if (cl.includes("banano")) return "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=280&fit=crop";
          if (cl.includes("logística") || cl.includes("logistica")) return "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=280&fit=crop";
          if (cl.includes("palma")) return "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=280&fit=crop";
          // Generic colorful market image
          return "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=280&fit=crop";
        })(),
        profileId: prof.id,
        profile: prof,
      });
    });
  });

  const allItems = [...STATIC_PRODUCTS, ...realListings];

  const filtered = allItems.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || (p.nombre||"").toLowerCase().includes(q) || (p.empresa||"").toLowerCase().includes(q) || (p.desc||"").toLowerCase().includes(q) || (p.cluster||"").toLowerCase().includes(q) || (p.municipio||"").toLowerCase().includes(q);
    const matchC = !selectedCluster || p.cluster === selectedCluster;
    return matchQ && matchC;
  });

  const clusterCounts = {};
  allItems.forEach(p => { clusterCounts[p.cluster] = (clusterCounts[p.cluster] || 0) + 1; });

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, margin: "0 0 4px" }}>Marketplace Ruta C</h1>
        <p style={{ color: "#666", fontSize: 14, margin: 0 }}>Productos y servicios de emprendedores del Magdalena · {allItems.length} ofertas</p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar productos, empresas o servicios..." style={{ ...base.input, paddingLeft: 42, fontSize: 15 }} />
      </div>

      {/* Cluster filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <button onClick={() => setSelectedCluster(null)} style={{ background: !selectedCluster ? "#1A1A2E" : "#fff", color: !selectedCluster ? "#fff" : "#555", border: "1.5px solid", borderColor: !selectedCluster ? "#1A1A2E" : "#D8DDE5", borderRadius: 20, padding: "6px 16px", fontSize: 13, cursor: "pointer", fontFamily: base.fontFamily, fontWeight: 500 }}>
          Todos ({allItems.length})
        </button>
        {CLUSTERS.map(c => {
          const count = clusterCounts[c.titulo] || 0;
          if (!count) return null;
          return (
            <button key={c.id} onClick={() => setSelectedCluster(c.titulo)} style={{ background: selectedCluster === c.titulo ? c.color : "#fff", color: selectedCluster === c.titulo ? "#fff" : "#555", border: "1.5px solid", borderColor: selectedCluster === c.titulo ? c.color : "#D8DDE5", borderRadius: 20, padding: "6px 16px", fontSize: 13, cursor: "pointer", fontFamily: base.fontFamily, fontWeight: 500 }}>
              {c.titulo} ({count})
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</p>

      {/* Products grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px,1fr))", gap: 20 }}>
        {filtered.map(p => {
          const c = CLUSTERS.find(cl => cl.titulo === p.cluster) || CLUSTERS[0];
          return (
            <div key={p.id} onClick={() => setSelectedBiz(p)} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", cursor: "pointer", transition: "box-shadow .15s", display: "flex", flexDirection: "column" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.14)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"}
            >
              {/* Image */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                {p.img ? (
                  <img src={p.img} alt="" style={{ width: "100%", height: 185, objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: 120, background: `linear-gradient(135deg,${c.color}25,${c.color}08)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: c.color + "22", border: `2px solid ${c.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: c.color }}>
                      {getInitials(p.empresa || "")}
                    </div>
                  </div>
                )}
                <span style={{ position: "absolute", top: 10, left: 10, background: c.color, color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{p.cluster}</span>
                {p.profileId && <span style={{ position: "absolute", top: 10, right: 10, background: "#1A1A2E", color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 600 }}>🔴 Ruta C</span>}
              </div>
              {/* Content */}
              <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{p.nombre}</p>
                <p style={{ margin: "0 0 6px", fontSize: 12, color: "#888" }}>{p.empresa} · {p.municipio}</p>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "#555", lineHeight: 1.5, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  <span style={{ fontWeight: 800, color: c.color, fontSize: 14 }}>{p.precio}</span>
                  <button onClick={e => { e.stopPropagation(); window.open(`https://wa.me/57${p.whatsapp}?text=Hola, vi tu oferta en Ruta C Conecta: "${p.nombre}". Me interesa.`, "_blank"); }} style={{ background: "#25D366", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: base.fontFamily }}>
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", color: "#888" }}>
          <p style={{ fontSize: 16 }}>No se encontraron productos para tu búsqueda.</p>
          <button onClick={() => { setSearch(""); setSelectedCluster(null); }} style={{ background: "#0F9B8E", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontFamily: base.fontFamily, fontWeight: 600, marginTop: 12 }}>Ver todos</button>
        </div>
      )}

      {/* ===== BUSINESS / PRODUCT DETAIL MODAL ===== */}
      {selectedBiz && (() => {
        const c = CLUSTERS.find(cl => cl.titulo === selectedBiz.cluster) || CLUSTERS[0];
        const isRealProfile = !!selectedBiz.profileId;
        const prof = selectedBiz.profile;
        const allProds = isRealProfile ? (productosMap[selectedBiz.profileId] || []) : null;
        const simScore = isRealProfile ? calcSimilarity(user, prof) : null;

        return (
          <div onClick={() => setSelectedBiz(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem" }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 620, maxHeight: "92vh", overflowY: "auto" }}>

              {/* Hero image */}
              <div style={{ position: "relative" }}>
                {selectedBiz.img ? (
                  <img src={selectedBiz.img} alt="" style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: "20px 20px 0 0" }} />
                ) : (
                  <div style={{ width: "100%", height: 120, background: `linear-gradient(135deg,${c.color}30,${c.color}10)`, borderRadius: "20px 20px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: c.color + "22", border: `2.5px solid ${c.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, color: c.color }}>{getInitials(selectedBiz.empresa || "")}</div>
                  </div>
                )}
                <button onClick={() => setSelectedBiz(null)} style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                <span style={{ position: "absolute", top: 12, left: 12, background: c.color, color: "#fff", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>{selectedBiz.cluster}</span>
              </div>

              <div style={{ padding: "1.5rem" }}>
                {/* Product info */}
                <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>{selectedBiz.nombre}</h2>
                <p style={{ margin: "0 0 6px", color: "#888", fontSize: 14 }}>{selectedBiz.empresa} · {selectedBiz.municipio}{selectedBiz.etapa ? ` · ${selectedBiz.etapa}` : ""}</p>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "12px 0 16px" }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: c.color }}>{selectedBiz.precio}</span>
                  {simScore !== null && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 80, height: 5, background: "#E0E0E0", borderRadius: 3 }}>
                        <div style={{ height: "100%", width: `${simScore}%`, background: c.color, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: c.color }}>{simScore}% afinidad</span>
                    </div>
                  )}
                </div>

                <p style={{ color: "#444", fontSize: 14, lineHeight: 1.7, margin: "0 0 20px" }}>{selectedBiz.desc}</p>

                {/* If it's a real Ruta C profile, show all their products */}
                {isRealProfile && allProds && allProds.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 12px" }}>Todos sus productos ({allProds.length})</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {allProds.map((prod, pi) => (
                        <div key={pi} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #EAEAEA", background: "#F8F9FA" }}>
                          {prod.imageUrl && <img src={prod.imageUrl} alt="" style={{ width: "100%", height: 110, objectFit: "cover" }} />}
                          <div style={{ padding: "10px 12px" }}>
                            <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: 13 }}>{prod.nombre}</p>
                            {prod.precio && <p style={{ margin: "0 0 3px", fontSize: 13, color: c.color, fontWeight: 700 }}>{prod.precio}</p>}
                            {prod.descripcion && <p style={{ margin: 0, fontSize: 12, color: "#666", lineHeight: 1.4 }}>{prod.descripcion}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real profile extra info */}
                {isRealProfile && prof && (
                  <div style={{ background: "#F8F9FA", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
                    {[
                      ["Sector / Clúster", prof.cluster],
                      ["Municipio", prof.municipio],
                      ["Barrio", prof.barrio],
                      ["Etapa empresarial", prof.etapa],
                      ["Tiempo operando", prof.tiempo_operando],
                    ].filter(([,v]) => v).map(([k,v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #EAEAEA" }}>
                        <span style={{ fontSize: 12, color: "#888" }}>{k}</span>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <button onClick={() => window.open(`https://wa.me/57${selectedBiz.whatsapp}?text=Hola, vi tu oferta en Ruta C Conecta: "${selectedBiz.nombre}". Me interesa, ¿podemos conversar?`, "_blank")} style={{ width: "100%", background: "#25D366", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 16, cursor: "pointer", fontWeight: 700, fontFamily: base.fontFamily, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  📱 Contactar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ==================== ADMIN DASHBOARD ====================
function AdminDashboard({ onLogout, user }) {
  const [page, setPage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [clusterFilter, setClusterFilter] = useState("");
  const [supaUsers, setSupaUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Load real users from Supabase
  useEffect(() => {
    supabase.from("perfiles").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setSupaUsers(data);
        setLoadingUsers(false);
      });
  }, []);

  const lsUsers = Object.values(loadUsers());
  const csvRows = REGISTRADOS_MUESTRA.map(r => ({
    razon_social: r.s, municipio: r.mu, ciiu: r.ci, nit: r.ni,
    matricula: r.ma, email: r.em, telefono: r.te, tipoOrg: r.to, estado: r.es, cluster: "",
  }));

  // Combined: Supabase users (real) + CSV sample
  const allEmpresas = [...supaUsers, ...csvRows];
  const totalRegistrados = TOTAL_REGISTRADOS;

  const clusterList = [
    { id: "TURISMO", titulo: "Turismo", color: "#0F9B8E", bgLight: "#E1F5EE", total: CLUSTER_CONTEO.TURISMO || 245 },
    { id: "LOGISTICA", titulo: "Logística", color: "#185FA5", bgLight: "#E6F1FB", total: CLUSTER_CONTEO.LOGISTICA || 245 },
    { id: "BANANO", titulo: "Banano", color: "#BA7517", bgLight: "#FAEEDA", total: CLUSTER_CONTEO.BANANO || 245 },
    { id: "PALMADEACEITE", titulo: "Palma de Aceite", color: "#3B6D11", bgLight: "#EAF3DE", total: CLUSTER_CONTEO.PALMADEACEITE || 147 },
    { id: "CACAO", titulo: "Cacao", color: "#6D4C1F", bgLight: "#F3E8DC", total: CLUSTER_CONTEO.CACAO || 4 },
    { id: "MANGO", titulo: "Mango", color: "#E65100", bgLight: "#FFF3E0", total: CLUSTER_CONTEO.MANGO || 52 },
    { id: "CAFE", titulo: "Café", color: "#5D4037", bgLight: "#EFEBE9", total: CLUSTER_CONTEO.CAFE || 48 },
    { id: "YUCA", titulo: "Yuca", color: "#558B2F", bgLight: "#F1F8E9", total: CLUSTER_CONTEO.YUCA || 14 },
  ];

  const etapaColors = {
    "Ideación": "#9C27B0", "Inicio": "#0F9B8E", "Crecimiento": "#4CAF50",
    "Consolidación": "#185FA5", "Madurez": "#FF9800", "Expansión": "#D85A30"
  };

  // Stats from real Supabase users
  const realUserCount = supaUsers.filter(u => u.role !== "admin").length;
  const clusterCountReal = clusterList.reduce((acc, c) => {
    acc[c.titulo] = supaUsers.filter(u => u.cluster === c.titulo).length;
    return acc;
  }, {});
  const etapaCountReal = ETAPAS.reduce((acc, e) => {
    acc[e] = supaUsers.filter(u => u.etapa === e).length;
    return acc;
  }, {});
  const muniData = Object.entries(MUNICIPIO_CONTEO).slice(0, 10);
  const maxMuni = Math.max(...muniData.map(([,v]) => v));

  // Filter for empresa table
  const filteredEmpresas = allEmpresas.filter(u => {
    const q = search.toLowerCase();
    const name = (u.razon_social || u.razonSocial || "").toLowerCase();
    const muni = (u.municipio || "").toLowerCase();
    const nit = (u.nit || "").toLowerCase();
    const matchSearch = !q || name.includes(q) || muni.includes(q) || nit.includes(q);
    const matchCluster = !clusterFilter || u.cluster === clusterFilter;
    return matchSearch && matchCluster;
  });

  const navItems = ["Dashboard", "Emprendedores", "Empresas SII", "Clusters", "Reportes"];

  return (
    <div style={{ fontFamily: base.fontFamily, minHeight: "100vh", background: "#F0F4F8" }}>

      {/* Sidebar + top nav layout */}
      <div style={{ display: "flex", minHeight: "100vh" }}>

        {/* Sidebar */}
        <aside style={{ width: 220, background: "#1A1A2E", display: "flex", flexDirection: "column", position: "fixed", height: "100vh", zIndex: 50 }}>
          {/* Logo */}
          <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#0F9B8E", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 16 }}>C</div>
              <div>
                <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 14 }}>Ruta C</p>
                <p style={{ margin: 0, color: "#0F9B8E", fontSize: 11, fontWeight: 600 }}>ADMIN</p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav style={{ padding: "1rem 0", flex: 1 }}>
            {[
              { label: "Dashboard", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
              { label: "Emprendedores", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
              { label: "Empresas SII", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> },
              { label: "Clusters", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> },
              { label: "Reportes", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
            ].map(item => (
              <button key={item.label} onClick={() => setPage(item.label)} style={{
                width: "100%", padding: "11px 20px", background: page === item.label ? "rgba(15,155,142,0.15)" : "none",
                border: "none", borderLeft: page === item.label ? "3px solid #0F9B8E" : "3px solid transparent",
                color: page === item.label ? "#0F9B8E" : "rgba(255,255,255,0.6)",
                textAlign: "left", cursor: "pointer", fontSize: 14, fontFamily: base.fontFamily,
                display: "flex", alignItems: "center", gap: 10, fontWeight: page === item.label ? 600 : 400,
              }}>{item.icon}{item.label}</button>
            ))}
          </nav>

          {/* User info at bottom */}
          <div style={{ padding: "1rem 1.2rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ margin: "0 0 2px", color: "#fff", fontSize: 13, fontWeight: 600 }}>Cámara de Comercio</p>
            <p style={{ margin: "0 0 10px", color: "rgba(255,255,255,0.4)", fontSize: 11 }}>camara@rutac.gov.co</p>
            <button onClick={onLogout} style={{ background: "rgba(216,90,48,0.15)", border: "1px solid rgba(216,90,48,0.3)", color: "#D85A30", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontFamily: base.fontFamily, width: "100%" }}>Cerrar sesión</button>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ marginLeft: 220, flex: 1, padding: "2rem" }}>

          {/* ===== DASHBOARD ===== */}
          {page === "Dashboard" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, margin: "0 0 4px", color: "#1A1A2E" }}>Dashboard de control</h1>
                <p style={{ color: "#666", fontSize: 14, margin: 0 }}>Cámara de Comercio de Santa Marta · Ecosistema empresarial del Magdalena</p>
              </div>

              {/* KPI Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { val: totalRegistrados.toLocaleString(), label: "Empresas en SII", sub: "Registro mercantil activo", color: "#0F9B8E", icon: "🏢" },
                  { val: realUserCount, label: "Emprendedores Ruta C", sub: "Registrados en la plataforma", color: "#185FA5", icon: "👤" },
                  { val: clusterList.length, label: "Clústeres activos", sub: "Sectores productivos", color: "#9C27B0", icon: "🔗" },
                  { val: Object.keys(MUNICIPIO_CONTEO).length, label: "Municipios", sub: "Con presencia empresarial", color: "#BA7517", icon: "📍" },
                ].map(k => (
                  <div key={k.label} style={{ background: "#fff", borderRadius: 16, padding: "1.25rem 1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${k.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{k.label}</p>
                        <h3 style={{ margin: "0 0 2px", fontSize: 32, fontWeight: 800, color: k.color }}>{k.val}</h3>
                        <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{k.sub}</p>
                      </div>
                      <span style={{ fontSize: 28 }}>{k.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                {/* Cluster distribution */}
                <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Empresas por clúster (SII)</h3>
                  {clusterList.map(c => {
                    const pct = Math.round((c.total / 245) * 100);
                    return (
                      <div key={c.id} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color }} />
                            <span style={{ fontSize: 13 }}>{c.titulo}</span>
                          </div>
                          <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>{c.total}</span>
                        </div>
                        <div style={{ height: 6, background: "#F0F0F0", borderRadius: 4 }}>
                          <div style={{ height: "100%", width: `${Math.min(pct,100)}%`, background: c.color, borderRadius: 4 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Municipality distribution */}
                <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Top municipios</h3>
                  {muniData.map(([muni, count]) => (
                    <div key={muni} style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 13 }}>{muni.charAt(0) + muni.slice(1).toLowerCase()}</span>
                        <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>{count.toLocaleString()}</span>
                      </div>
                      <div style={{ height: 5, background: "#F0F0F0", borderRadius: 4 }}>
                        <div style={{ height: "100%", width: `${Math.round((count/maxMuni)*100)}%`, background: "#0F9B8E", borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ruta C users stats + recent */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Emprendedores por etapa</h3>
                  {ETAPAS.map(e => {
                    const count = etapaCountReal[e] || 0;
                    return (
                      <div key={e} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F5F5F5" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: etapaColors[e] || "#888" }} />
                          <span style={{ fontSize: 13 }}>{e}</span>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: etapaColors[e] || "#888" }}>{count}</span>
                      </div>
                    );
                  })}
                  <div style={{ marginTop: 14, padding: "10px 14px", background: "#F0FBF9", borderRadius: 10 }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#0F9B8E", fontWeight: 600 }}>Total en Ruta C: {realUserCount} emprendedores</p>
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Últimos registros en Ruta C</h3>
                  {loadingUsers ? (
                    <p style={{ color: "#888", fontSize: 13 }}>Cargando...</p>
                  ) : supaUsers.filter(u => u.role !== "admin").slice(0, 6).map((u, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #F5F5F5" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: clusterColor(u.cluster) + "18", border: `2px solid ${clusterColor(u.cluster)}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: clusterColor(u.cluster), flexShrink: 0 }}>
                        {getInitials(u.razon_social)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: "0 0 1px", fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.razon_social || "Sin nombre"}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{u.municipio} · {u.cluster || "Sin clúster"}</p>
                      </div>
                      <span style={{ fontSize: 11, background: (etapaColors[u.etapa] || "#888") + "18", color: etapaColors[u.etapa] || "#888", borderRadius: 20, padding: "2px 8px", fontWeight: 600, whiteSpace: "nowrap" }}>{u.etapa || "Inicio"}</span>
                    </div>
                  ))}
                  {supaUsers.filter(u => u.role !== "admin").length === 0 && !loadingUsers && (
                    <p style={{ color: "#888", fontSize: 13 }}>Aún no hay emprendedores registrados.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ===== EMPRENDEDORES (usuarios reales de Supabase) ===== */}
          {page === "Emprendedores" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, margin: "0 0 4px" }}>Emprendedores registrados</h1>
                  <p style={{ color: "#666", fontSize: 14, margin: 0 }}>{realUserCount} usuarios activos en Ruta C Conecta</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
                  <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar emprendedor..." style={{ ...base.input, paddingLeft: 36, fontSize: 14 }} />
                </div>
                <select value={clusterFilter} onChange={e => setClusterFilter(e.target.value)} style={{ ...base.input, width: 200 }}>
                  <option value="">Todos los clústeres</option>
                  {clusterList.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}
                </select>
              </div>

              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8F9FA" }}>
                      {["Emprendedor", "Email", "Municipio", "Clúster", "Etapa", "WhatsApp", "Registrado"].map(h => (
                        <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 600, color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers && <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#888" }}>Cargando...</td></tr>}
                    {!loadingUsers && supaUsers.filter(u => u.role !== "admin").filter(u => {
                      const q = search.toLowerCase();
                      return (!q || (u.razon_social || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q))
                        && (!clusterFilter || u.cluster === clusterFilter);
                    }).map((u, i) => (
                      <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
                        <td style={{ padding: "10px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 30, height: 30, borderRadius: "50%", background: clusterColor(u.cluster) + "18", border: `1.5px solid ${clusterColor(u.cluster)}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: clusterColor(u.cluster), flexShrink: 0 }}>
                              {getInitials(u.razon_social)}
                            </div>
                            <span style={{ fontWeight: 500 }}>{u.razon_social || "Sin nombre"}</span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 14px", color: "#555", fontSize: 12 }}>{u.email || "—"}</td>
                        <td style={{ padding: "10px 14px", color: "#555" }}>{u.municipio || "—"}</td>
                        <td style={{ padding: "10px 14px" }}>
                          {u.cluster && <span style={{ background: clusterColor(u.cluster) + "18", color: clusterColor(u.cluster), borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{u.cluster}</span>}
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          {u.etapa && <span style={{ background: (etapaColors[u.etapa] || "#888") + "18", color: etapaColors[u.etapa] || "#888", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{u.etapa}</span>}
                        </td>
                        <td style={{ padding: "10px 14px", color: "#555", fontSize: 12 }}>{u.whatsapp ? `+57 ${u.whatsapp}` : "—"}</td>
                        <td style={{ padding: "10px 14px", color: "#888", fontSize: 11 }}>{u.created_at ? new Date(u.created_at).toLocaleDateString("es-CO") : "—"}</td>
                      </tr>
                    ))}
                    {!loadingUsers && supaUsers.filter(u => u.role !== "admin").length === 0 && (
                      <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#888" }}>Aún no hay emprendedores registrados en la plataforma.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ===== EMPRESAS SII ===== */}
          {page === "Empresas SII" && (
            <>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, margin: "0 0 4px" }}>Empresas registradas en SII</h1>
                <p style={{ color: "#666", fontSize: 14, margin: 0 }}>Muestra de {REGISTRADOS_MUESTRA.length} de {totalRegistrados.toLocaleString()} empresas totales</p>
              </div>
              <div style={{ position: "relative", marginBottom: 16 }}>
                <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por razón social, NIT o municipio..." style={{ ...base.input, paddingLeft: 36, fontSize: 14 }} />
              </div>
              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F8F9FA" }}>
                        {["Razón Social", "Municipio", "NIT", "Matrícula", "Tipo", "Teléfono", "Estado"].map(h => (
                          <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {REGISTRADOS_MUESTRA.filter(u => {
                        const q = search.toLowerCase();
                        return !q || u.s.toLowerCase().includes(q) || u.mu.toLowerCase().includes(q) || u.ni.includes(q);
                      }).slice(0, 80).map((u, i) => (
                        <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
                          <td style={{ padding: "9px 14px", fontWeight: 500, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.s}</td>
                          <td style={{ padding: "9px 14px", color: "#555", whiteSpace: "nowrap" }}>{u.mu}</td>
                          <td style={{ padding: "9px 14px", color: "#666", fontSize: 12 }}>{u.ni}</td>
                          <td style={{ padding: "9px 14px", color: "#666", fontSize: 12 }}>{u.ma}</td>
                          <td style={{ padding: "9px 14px", color: "#555", fontSize: 12, whiteSpace: "nowrap" }}>{u.to}</td>
                          <td style={{ padding: "9px 14px", color: "#555", fontSize: 12 }}>{u.te}</td>
                          <td style={{ padding: "9px 14px" }}>
                            <span style={{ background: "#E8F5E9", color: "#4CAF50", borderRadius: 12, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{u.es}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ===== CLUSTERS ===== */}
          {page === "Clusters" && (
            <>
              <h1 style={{ fontSize: 24, margin: "0 0 4px" }}>Clústeres del Magdalena</h1>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Sectores productivos estratégicos monitoreados</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
                {clusterList.map(c => {
                  const miembros = CLUSTER_MIEMBROS_REALES[c.id] || [];
                  const rutaCCount = clusterCountReal[c.titulo] || 0;
                  return (
                    <div key={c.id} style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderTop: `3px solid ${c.color}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 14, height: 14, borderRadius: "50%", background: c.color }} />
                          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{c.titulo}</h3>
                        </div>
                        <span style={{ background: "#E8F5E9", color: "#4CAF50", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>ACTIVO</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                        <div style={{ background: c.bgLight, borderRadius: 10, padding: "10px 14px" }}>
                          <p style={{ margin: "0 0 2px", fontSize: 11, color: c.color, fontWeight: 600 }}>EN SII</p>
                          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: c.color }}>{c.total}</p>
                        </div>
                        <div style={{ background: "#F0FBF9", borderRadius: 10, padding: "10px 14px" }}>
                          <p style={{ margin: "0 0 2px", fontSize: 11, color: "#0F9B8E", fontWeight: 600 }}>EN RUTA C</p>
                          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0F9B8E" }}>{rutaCCount}</p>
                        </div>
                      </div>
                      <div style={{ height: 5, background: "#F0F0F0", borderRadius: 4, marginBottom: 12 }}>
                        <div style={{ height: "100%", width: `${Math.min(Math.round((c.total/245)*100),100)}%`, background: c.color, borderRadius: 4 }} />
                      </div>
                      {miembros.length > 0 && (
                        <div>
                          <p style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>Muestra de empresas SII</p>
                          {miembros.slice(0, 3).map((m, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", borderBottom: i < 2 ? "1px solid #F5F5F5" : "none" }}>
                              <div style={{ width: 24, height: 24, borderRadius: "50%", background: c.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: c.color, flexShrink: 0 }}>
                                {m.s.split(" ").slice(0,2).map(w=>w[0]).join("")}
                              </div>
                              <span style={{ fontSize: 12, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.s}</span>
                            </div>
                          ))}
                          {miembros.length > 3 && <p style={{ fontSize: 11, color: "#888", margin: "6px 0 0" }}>+{miembros.length - 3} más</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ===== REPORTES ===== */}
          {page === "Reportes" && (
            <>
              <h1 style={{ fontSize: 24, margin: "0 0 4px" }}>Reportes y proyecciones</h1>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Análisis del ecosistema empresarial del Magdalena</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Total SII", val: totalRegistrados.toLocaleString(), sub: "Empresas con matrícula activa", color: "#0F9B8E" },
                  { label: "Santa Marta", val: "7.800", sub: "78% del total departamental", color: "#185FA5" },
                  { label: "Emprendedores digitales", val: realUserCount, sub: "En Ruta C Conecta", color: "#9C27B0" },
                ].map(k => (
                  <div key={k.label} style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>{k.label}</p>
                    <h3 style={{ margin: "0 0 2px", fontSize: 32, fontWeight: 800, color: k.color }}>{k.val}</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{k.sub}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Distribución por municipio</h3>
                  {Object.entries(MUNICIPIO_CONTEO).map(([muni, count]) => (
                    <div key={muni} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F5F5F5" }}>
                      <span style={{ fontSize: 13 }}>{muni.charAt(0) + muni.slice(1).toLowerCase()}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 70, height: 4, background: "#F0F0F0", borderRadius: 3 }}>
                          <div style={{ height: "100%", width: `${Math.round((count/7800)*100)}%`, background: "#0F9B8E", borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, minWidth: 44, textAlign: "right" }}>{count.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Resumen ejecutivo</h3>
                  <p style={{ color: "#555", fontSize: 14, lineHeight: 1.8 }}>
                    El Magdalena cuenta con <strong>{totalRegistrados.toLocaleString()} empresas</strong> en el SII. Santa Marta concentra el <strong>78%</strong> ({MUNICIPIO_CONTEO["SANTA MARTA"]?.toLocaleString()}) del tejido empresarial departamental.
                  </p>
                  <p style={{ color: "#555", fontSize: 14, lineHeight: 1.8, marginTop: 12 }}>
                    Los clústeres de <strong>Turismo, Logística y Banano</strong> lideran con 245 empresas cada uno. Ruta C ha incorporado digitalmente a <strong>{realUserCount} emprendedores</strong>, con potencial de escalar a los {totalRegistrados.toLocaleString()} registros del SII.
                  </p>
                  <div style={{ marginTop: 16, padding: "12px 16px", background: "#F0FBF9", borderRadius: 10 }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#0F9B8E", fontWeight: 600 }}>Tasa de adopción digital: {totalRegistrados > 0 ? ((realUserCount / totalRegistrados) * 100).toFixed(2) : 0}%</p>
                  </div>
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}

// ==================== MOTOR IA: CLUSTERING + RECOMENDACIONES ====================

// Score de similitud entre dos empresas (0-100)
function calcSimilarity(a, b) {
  let score = 0;
  if (!a || !b) return 0;
  // Mismo cluster = 35 pts
  if (a.cluster && b.cluster && a.cluster === b.cluster) score += 35;
  // Mismo municipio = 20 pts
  if (a.municipio && b.municipio && a.municipio === b.municipio) score += 20;
  // Etapa complementaria = 15 pts
  const etapas = ["Ideación","Inicio","Crecimiento","Consolidación","Madurez","Expansión"];
  const ia = etapas.indexOf(a.etapa); const ib = etapas.indexOf(b.etapa);
  if (ia >= 0 && ib >= 0) {
    const diff = Math.abs(ia - ib);
    if (diff === 0) score += 15;
    else if (diff === 1) score += 10;
    else if (diff === 2) score += 5;
  }
  // Descripcion tiene palabras en común = hasta 20 pts
  if (a.descripcion && b.descripcion) {
    const wa = new Set(a.descripcion.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 4));
    const wb = new Set(b.descripcion.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 4));
    const common = [...wa].filter(w => wb.has(w)).length;
    score += Math.min(20, common * 4);
  }
  // Registrado en cámara = +10 pts
  if (a.registrado_camara === 'si' && b.registrado_camara === 'si') score += 10;
  return Math.min(100, score);
}

// Tipo de relación entre dos empresas
function tipoRelacion(a, b) {
  if (!a || !b) return "Referente";
  const ia = ["Ideación","Inicio","Crecimiento","Consolidación","Madurez","Expansión"].indexOf(a.etapa);
  const ib = ["Ideación","Inicio","Crecimiento","Consolidación","Madurez","Expansión"].indexOf(b.etapa);
  if (a.cluster === b.cluster && Math.abs(ia - ib) <= 1) return "Aliado estratégico";
  if (ib > ia + 1) return "Referente";
  if (ib < ia - 1) return "Cliente potencial";
  if (a.cluster !== b.cluster) return "Proveedor";
  return "Aliado estratégico";
}

// Justificación de por qué se recomienda
function justificacion(a, b, tipo) {
  const razones = [];
  if (a.cluster === b.cluster) razones.push(`Ambos pertenecen al clúster de ${a.cluster}`);
  if (a.municipio === b.municipio) razones.push(`Están en el mismo municipio (${a.municipio})`);
  if (tipo === "Referente") razones.push(`${b.razon_social} tiene mayor trayectoria y puede orientarte`);
  if (tipo === "Cliente potencial") razones.push(`Perfil comprador compatible con tu oferta`);
  if (tipo === "Proveedor") razones.push(`Sector complementario que puede fortalecer tu cadena de valor`);
  if (b.completitud >= 85) razones.push("Perfil completo con alta credibilidad");
  return razones.length > 0 ? razones.join(" · ") : "Perfil con alta afinidad con tu negocio";
}

// Generar recomendaciones IA para un usuario dado todos los perfiles
function generarRecomendaciones(user, allProfiles) {
  if (!user || !allProfiles?.length) return [];
  return allProfiles
    .filter(p => p.id !== user.id && p.role !== 'admin')
    .map(p => ({
      ...p,
      score: calcSimilarity(user, p),
      tipo: tipoRelacion(user, p),
      why: justificacion(user, p, tipoRelacion(user, p)),
    }))
    .filter(p => p.score > 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

// Cluster dinámico: agrupar todos los perfiles
function generarClusters(profiles) {
  const grupos = {};
  profiles.forEach(p => {
    const key = p.cluster || "Sin clúster";
    if (!grupos[key]) grupos[key] = [];
    grupos[key].push(p);
  });
  return Object.entries(grupos).map(([cluster, miembros]) => ({
    cluster,
    miembros,
    total: miembros.length,
    etapas: miembros.reduce((acc, m) => { acc[m.etapa || "Inicio"] = (acc[m.etapa || "Inicio"] || 0) + 1; return acc; }, {}),
    municipios: [...new Set(miembros.map(m => m.municipio).filter(Boolean))],
    avgCompletitud: Math.round(miembros.reduce((s, m) => s + (m.completitud || 70), 0) / miembros.length),
  }));
}

// Score de formalización (0-100)
function scoreFormalización(user) {
  let score = 0;
  if (user.nit) score += 20;
  if (user.registrado_camara === 'si') score += 25;
  if (user.descripcion?.length > 50) score += 15;
  if (user.whatsapp) score += 10;
  if (user.barrio) score += 10;
  if ((user.completitud || 0) >= 80) score += 20;
  return Math.min(100, score);
}

// Ruta de formalización personalizada
function rutaFormalización(user) {
  const pasos = [
    { id: 1, titulo: "Registra tu WhatsApp de negocio", desc: "Un número de contacto directo aumenta la confianza de clientes y aliados.", done: !!user.whatsapp, accion: "Mi negocio → General" },
    { id: 2, titulo: "Describe tus productos y servicios", desc: "Las fotos y precios generan más conexiones y aparecen en el Marketplace.", done: false, accion: "Mi negocio → Productos y servicios" },
    { id: 3, titulo: "Agrega tu NIT", desc: "El NIT es necesario para facturar y contratar con empresas formales.", done: !!user.nit, accion: "Mi negocio → General" },
    { id: 4, titulo: "Conecta con 3 aliados estratégicos", desc: "Las conexiones activas aumentan tu visibilidad y las recomendaciones del motor IA.", done: false, accion: "Ir a Recomendaciones" },
    { id: 5, titulo: "Verifica tus datos de ubicación", desc: "El barrio y municipio correctos mejoran las recomendaciones geográficas del motor.", done: !!(user.barrio && user.municipio), accion: "Mi negocio → General" },
  ];
  return pasos;
}

// ==================== AGENTE INTELIGENTE ====================
function AgentePanel({ user, allProfiles, onNavigate }) {
  const [alertas, setAlertas] = useState([]);
  const [ejecutando, setEjecutando] = useState(false);
  const [lastRun, setLastRun] = useState(null);

  const ejecutarAgente = async () => {
    setEjecutando(true);
    await new Promise(r => setTimeout(r, 1800)); // simula procesamiento
    const nuevasAlertas = [];
    const recs = generarRecomendaciones(user, allProfiles);

    // Alerta 1: nuevas conexiones disponibles
    if (recs.length > 0) {
      nuevasAlertas.push({
        tipo: "conexion",
        icon: "🔗",
        titulo: `${recs.length} nuevas conexiones relevantes detectadas`,
        desc: `El agente encontró empresas con alta afinidad a tu perfil. La más relevante: ${recs[0]?.razon_social} (${recs[0]?.score}% de match)`,
        accion: "Ver recomendaciones",
        page: "Recomendaciones",
        color: "#0F9B8E",
      });
    }

    // Alerta 2: perfil - siempre dar sugerencia de mejora con impacto en recomendaciones
    const completitud = user.completitud || 70;
    const completitudTip = completitud < 80
      ? `Tu perfil tiene ${completitud}% de completitud. Al agregar descripción, productos y barrio el motor IA encontrará conexiones más relevantes para tu negocio.`
      : `Tu perfil tiene ${completitud}% de completitud. Agrega fotos de productos para aparecer en más búsquedas del Marketplace.`;
    nuevasAlertas.push({
      tipo: "perfil",
      icon: completitud >= 90 ? "✨" : "💡",
      titulo: completitud >= 90 ? "Perfil excelente — sigue así" : "Mejora tu perfil para más conexiones",
      desc: completitudTip,
      accion: completitud >= 90 ? "Ver mis recomendaciones" : "Mejorar mi perfil",
      page: completitud >= 90 ? "Recomendaciones" : "Mi negocio",
      color: completitud >= 90 ? "#4CAF50" : "#185FA5",
    });

    // Alerta 3: empresas del mismo cluster
    const mismoCluster = allProfiles.filter(p => p.cluster === user.cluster && p.id !== user.id);
    if (mismoCluster.length > 0) {
      nuevasAlertas.push({
        tipo: "cluster",
        icon: "🏘️",
        titulo: `${mismoCluster.length} empresas activas en tu clúster de ${user.cluster}`,
        desc: `Hay actividad reciente en tu clúster. Conecta con empresas similares para fortalecer la red.`,
        accion: "Ver mi clúster",
        page: "Mi clúster",
        color: "#185FA5",
      });
    }

    // Alerta 4: formalización
    const scoreF = scoreFormalización(user);
    if (scoreF < 60) {
      nuevasAlertas.push({
        tipo: "formalizacion",
        icon: "📋",
        titulo: "Tienes pasos pendientes en tu ruta de formalización",
        desc: `Tu score de formalización es ${scoreF}/100. Completar los pasos aumenta tu acceso a programas y convocatorias.`,
        accion: "Ver mi ruta",
        page: "Formalización",
        color: "#9C27B0",
      });
    }

    setAlertas(nuevasAlertas);
    setLastRun(new Date());
    setEjecutando(false);
  };

  // Auto-ejecutar al montar
  useEffect(() => { ejecutarAgente(); }, [user.id]);

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: "1px solid #EAEAEA", marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#0F9B8E,#185FA5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Conector Inteligente</h3>
            <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{lastRun ? `Último análisis: ${lastRun.toLocaleTimeString("es-CO")}` : "Analizando tu perfil..."}</p>
          </div>
        </div>
        <button onClick={ejecutarAgente} disabled={ejecutando} style={{ background: "#F0FBF9", border: "1px solid #0F9B8E", color: "#0F9B8E", borderRadius: 8, padding: "6px 14px", cursor: ejecutando ? "not-allowed" : "pointer", fontSize: 13, fontFamily: base.fontFamily, fontWeight: 600 }}>
          {ejecutando ? "⏳ Analizando..." : "🔄 Reanálizar"}
        </button>
      </div>
      {ejecutando && (
        <div style={{ textAlign: "center", padding: "1rem", color: "#888", fontSize: 13 }}>
          <div style={{ width: "100%", height: 4, background: "#F0F0F0", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "60%", background: "linear-gradient(90deg,#0F9B8E,#185FA5)", borderRadius: 2, animation: "pulse 1s infinite" }} />
          </div>
          <p style={{ marginTop: 8 }}>El agente está analizando tu perfil, clúster y conexiones potenciales...</p>
        </div>
      )}
      {!ejecutando && alertas.map((a, i) => (
        <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 10, background: a.color + "0D", border: `1px solid ${a.color}30`, marginBottom: 8 }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{a.icon}</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14, color: "#1A1A2E" }}>{a.titulo}</p>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "#555" }}>{a.desc}</p>
            <button onClick={() => onNavigate(a.page)} style={{ background: a.color, color: "#fff", border: "none", borderRadius: 8, padding: "5px 14px", fontSize: 12, cursor: "pointer", fontFamily: base.fontFamily, fontWeight: 600 }}>
              {a.accion} →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== RECOMENDACIONES IA ====================
function RecomendacionesIAPage({ user, allProfiles, onNavigate }) {
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState([]);
  const tipos = ["Todos", "Aliado estratégico", "Cliente potencial", "Proveedor", "Referente"];
  const tipoColor = { "Aliado estratégico": "#0F9B8E", "Cliente potencial": "#185FA5", "Proveedor": "#BA7517", "Referente": "#9C27B0" };

  const recs = generarRecomendaciones(user, allProfiles);
  const filtered = filter === "Todos" ? recs : recs.filter(r => r.tipo === filter);

  return (
    <div style={{ padding: "2rem", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, margin: "0 0 4px" }}>Recomendaciones del Conector</h1>
        <p style={{ color: "#666", fontSize: 14, margin: 0 }}>Motor IA · {recs.length} conexiones priorizadas para tu negocio</p>
      </div>

      <AgentePanel user={user} allProfiles={allProfiles} onNavigate={onNavigate} />

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tipos.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            background: filter === t ? "#1A1A2E" : "#fff", color: filter === t ? "#fff" : "#555",
            border: "1.5px solid", borderColor: filter === t ? "#1A1A2E" : "#D8DDE5",
            borderRadius: 20, padding: "6px 16px", fontSize: 13, cursor: "pointer",
            fontFamily: base.fontFamily, fontWeight: filter === t ? 600 : 400
          }}>{t} {t !== "Todos" && <span style={{ opacity: 0.7 }}>({recs.filter(r => r.tipo === t).length})</span>}</button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#888", background: "#F8F9FA", borderRadius: 16 }}>
          <p style={{ fontSize: 16 }}>No hay recomendaciones de este tipo aún.</p>
          <p style={{ fontSize: 13 }}>Completa tu perfil para mejorar las sugerencias del motor.</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((r, i) => (
            <div key={r.id || i} onClick={() => setSelected(r)} style={{
              background: "#fff", borderRadius: 14, padding: "1.25rem 1.5rem",
              border: selected?.id === r.id ? "2px solid #0F9B8E" : "1px solid #EAEAEA",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: (tipoColor[r.tipo] || "#0F9B8E") + "18", border: `2px solid ${tipoColor[r.tipo] || "#0F9B8E"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: tipoColor[r.tipo] || "#0F9B8E", flexShrink: 0 }}>
                  {getInitials(r.razon_social)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 15 }}>{r.razon_social}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: tipoColor[r.tipo] || "#0F9B8E" }}>{r.score}%</span>
                      {saved.includes(r.id) && <span style={{ fontSize: 11, background: "#E8F5E9", color: "#4CAF50", borderRadius: 10, padding: "2px 8px" }}>✓ Guardada</span>}
                    </div>
                  </div>
                  <p style={{ margin: "0 0 6px", fontSize: 12, color: "#888" }}>{r.cluster} · {r.municipio}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, background: (tipoColor[r.tipo] || "#0F9B8E") + "18", color: tipoColor[r.tipo] || "#0F9B8E", borderRadius: 20, padding: "2px 10px", fontWeight: 600 }}>{r.tipo}</span>
                    <span style={{ fontSize: 11, background: "#F8F9FA", color: "#666", borderRadius: 20, padding: "2px 10px" }}>{r.etapa}</span>
                  </div>
                  <p style={{ margin: "8px 0 0", fontSize: 12, color: "#555", fontStyle: "italic" }}>💡 {r.why}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: "1px solid #EAEAEA", position: "sticky", top: 80, height: "fit-content", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <button onClick={() => setSelected(null)} style={{ float: "right", background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>×</button>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: (tipoColor[selected.tipo] || "#0F9B8E") + "18", border: `2px solid ${tipoColor[selected.tipo] || "#0F9B8E"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: tipoColor[selected.tipo] || "#0F9B8E" }}>
                {getInitials(selected.razon_social)}
              </div>
              <div>
                <h3 style={{ margin: "0 0 2px", fontSize: 16 }}>{selected.razon_social}</h3>
                <span style={{ fontSize: 11, background: (tipoColor[selected.tipo] || "#0F9B8E") + "18", color: tipoColor[selected.tipo] || "#0F9B8E", borderRadius: 20, padding: "2px 10px", fontWeight: 600 }}>{selected.tipo}</span>
              </div>
            </div>

            <div style={{ background: "#F0FBF9", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: "#0F9B8E" }}>¿Por qué te lo recomendamos?</p>
              <p style={{ margin: 0, fontSize: 13, color: "#444" }}>{selected.why}</p>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ flex: 1, height: 6, background: "#E0E0E0", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${selected.score}%`, background: "linear-gradient(90deg,#0F9B8E,#185FA5)", borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#0F9B8E" }}>{selected.score}%</span>
              </div>
            </div>

            {[["Sector / Clúster", selected.cluster], ["Municipio", selected.municipio], ["Etapa", selected.etapa], ["Tiempo operando", selected.tiempo_operando]].map(([k, v]) => v && (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F5F5F5" }}>
                <span style={{ fontSize: 12, color: "#888" }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
              </div>
            ))}

            {selected.descripcion && (
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, margin: "12px 0" }}>{selected.descripcion.slice(0, 180)}...</p>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
              {selected.whatsapp && (
                <Btn small onClick={() => window.open(`https://wa.me/57${selected.whatsapp}`, "_blank")}>
                  WhatsApp
                </Btn>
              )}
              <Btn variant="secondary" small onClick={() => {
                if (!saved.includes(selected.id)) setSaved(s => [...s, selected.id]);
              }}>{saved.includes(selected.id) ? "✓ Guardada" : "Guardar"}</Btn>
              <Btn variant="ghost" small onClick={() => setSelected(null)}>Descartar</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== MARKETPLACE + BUSCADOR ====================
function MarketplaceBuscadorPage({ user, allProfiles }) {
  const [search, setSearch] = useState("");
  const [clusterFilter, setClusterFilter] = useState("");
  const [municipioFilter, setMunicipioFilter] = useState("");
  const [etapaFilter, setEtapaFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [productos, setProductos] = useState({});

  // Load productos from localStorage for each profile
  useEffect(() => {
    const p = {};
    allProfiles.forEach(prof => {
      try {
        const items = JSON.parse(localStorage.getItem("rutac_productos_" + prof.id) || "[]");
        if (items.length) p[prof.id] = items;
      } catch {}
    });
    setProductos(p);
  }, [allProfiles]);

  const results = allProfiles.filter(p => {
    if (p.id === user.id || p.role === 'admin') return false;
    const q = search.toLowerCase();
    const name = (p.razon_social || "").toLowerCase();
    const desc = (p.descripcion || "").toLowerCase();
    const matchQ = !q || name.includes(q) || desc.includes(q);
    const matchC = !clusterFilter || p.cluster === clusterFilter;
    const matchM = !municipioFilter || p.municipio === municipioFilter;
    const matchE = !etapaFilter || p.etapa === etapaFilter;
    return matchQ && matchC && matchM && matchE;
  });

  const municipios = [...new Set(allProfiles.map(p => p.municipio).filter(Boolean))].sort();

  return (
    <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, margin: "0 0 4px" }}>Marketplace · Buscar negocios</h1>
        <p style={{ color: "#666", fontSize: 14, margin: 0 }}>Descubre, conecta y explora productos de emprendedores del Magdalena</p>
      </div>

      {/* Search bar */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 20 }}>
        <div style={{ position: "relative", marginBottom: 12 }}>
          <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, sector, producto o servicio..." style={{ ...base.input, paddingLeft: 44, fontSize: 16, borderRadius: 12 }} />
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select value={clusterFilter} onChange={e => setClusterFilter(e.target.value)} style={{ ...base.input, flex: 1, minWidth: 160 }}>
            <option value="">Todos los clústeres</option>
            {CLUSTERS.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}
          </select>
          <select value={municipioFilter} onChange={e => setMunicipioFilter(e.target.value)} style={{ ...base.input, flex: 1, minWidth: 160 }}>
            <option value="">Todos los municipios</option>
            {municipios.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={etapaFilter} onChange={e => setEtapaFilter(e.target.value)} style={{ ...base.input, flex: 1, minWidth: 140 }}>
            <option value="">Todas las etapas</option>
            {ETAPAS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          {(search || clusterFilter || municipioFilter || etapaFilter) && (
            <button onClick={() => { setSearch(""); setClusterFilter(""); setMunicipioFilter(""); setEtapaFilter(""); }} style={{ background: "#FFF5F2", border: "1px solid #D85A30", color: "#D85A30", borderRadius: 8, padding: "0 14px", fontSize: 13, cursor: "pointer", fontFamily: base.fontFamily }}>Limpiar</button>
          )}
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 12, color: "#888" }}>{results.length} negocios encontrados</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 400px" : "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {results.map((p, i) => {
          const prods = productos[p.id] || [];
          const color = clusterColor(p.cluster);
          return (
            <div key={p.id || i} onClick={() => setSelected(p)} style={{
              background: "#fff", borderRadius: 16, overflow: "hidden",
              border: selected?.id === p.id ? `2px solid ${color}` : "1px solid #EAEAEA",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              transition: "box-shadow .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.12)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}
            >
              {/* Product image or cluster color header */}
              {prods[0]?.imageUrl ? (
                <img src={prods[0].imageUrl} alt="" style={{ width: "100%", height: 140, objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: 80, background: `linear-gradient(135deg, ${color}30, ${color}10)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: color + "20", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, color }}>
                    {getInitials(p.razon_social)}
                  </div>
                </div>
              )}
              <div style={{ padding: "14px 16px" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700 }}>{p.razon_social}</h3>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#888" }}>{p.cluster} · {p.municipio}</p>
                {p.descripcion && <p style={{ margin: "0 0 10px", fontSize: 13, color: "#555", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.descripcion}</p>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, background: color + "18", color, borderRadius: 20, padding: "2px 10px", fontWeight: 600 }}>{p.etapa || "Inicio"}</span>
                  {prods.length > 0 && <span style={{ fontSize: 11, color: "#888" }}>{prods.length} producto{prods.length > 1 ? "s" : ""}</span>}
                </div>
              </div>
            </div>
          );
        })}

        {/* Profile detail panel */}
        {selected && (() => {
          const prods = productos[selected.id] || [];
          const color = clusterColor(selected.cluster);
          const simScore = calcSimilarity(user, selected);
          return (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EAEAEA", overflow: "hidden", position: "sticky", top: 80, height: "fit-content", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
              <div style={{ background: `linear-gradient(135deg,${color}20,${color}08)`, padding: "1.5rem", borderBottom: "1px solid #F0F0F0" }}>
                <button onClick={() => setSelected(null)} style={{ float: "right", background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888" }}>×</button>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: color + "20", border: `2.5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color }}>
                    {getInitials(selected.razon_social)}
                  </div>
                  <div>
                    <h2 style={{ margin: "0 0 2px", fontSize: 18 }}>{selected.razon_social}</h2>
                    <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{selected.cluster} · {selected.municipio}</p>
                    <span style={{ display: "inline-block", marginTop: 4, background: color + "18", color, borderRadius: 20, padding: "2px 12px", fontSize: 11, fontWeight: 600 }}>{selected.etapa}</span>
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 5, background: "#E0E0E0", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${simScore}%`, background: color, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color }}>{simScore}% afinidad</span>
                </div>
              </div>

              <div style={{ padding: "1.25rem 1.5rem" }}>
                {selected.descripcion && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: 13 }}>Sobre el negocio</p>
                    <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.7 }}>{selected.descripcion}</p>
                  </div>
                )}

                {prods.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ margin: "0 0 10px", fontWeight: 600, fontSize: 13 }}>Productos y servicios ({prods.length})</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {prods.map((prod, pi) => (
                        <div key={pi} style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #EAEAEA" }}>
                          {prod.imageUrl && <img src={prod.imageUrl} alt="" style={{ width: "100%", height: 90, objectFit: "cover" }} />}
                          <div style={{ padding: "8px 10px" }}>
                            <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 12 }}>{prod.nombre}</p>
                            {prod.precio && <p style={{ margin: 0, fontSize: 11, color, fontWeight: 600 }}>{prod.precio}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selected.whatsapp && (
                    <Btn small onClick={() => window.open(`https://wa.me/57${selected.whatsapp}`, "_blank")}>WhatsApp</Btn>
                  )}
                  <Btn variant="secondary" small onClick={() => setSelected(null)}>Cerrar</Btn>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ==================== FORMALIZACIÓN ====================
function FormalizaciónPage({ user, setUserGlobal }) {
  const score = scoreFormalización(user);
  const pasos = rutaFormalización(user);
  const completados = pasos.filter(p => p.done).length;

  const programas = [
    { nombre: "Mujeres Productivas", entidad: "Cámara de Comercio", plazo: "30 Jun 2026", desc: "Apoyo y financiamiento para mujeres emprendedoras.", color: "#9C27B0" },
    { nombre: "Fondo Emprender", entidad: "SENA", plazo: "15 Jul 2026", desc: "Capital semilla no reembolsable para nuevas empresas.", color: "#0F9B8E" },
    { nombre: "Ruta al Mercado", entidad: "Cámara de Comercio", plazo: "Permanente", desc: "Conecta con compradores institucionales.", color: "#185FA5" },
    { nombre: "Formalización Express", entidad: "Cámara de Comercio", plazo: "Permanente", desc: "Formaliza tu negocio en menos de 5 días.", color: "#4CAF50" },
    { nombre: "TIC para Empresarios", entidad: "MinTIC", plazo: "01 Aug 2026", desc: "Subsidio para digitalización de pymes.", color: "#FF9800" },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, margin: "0 0 4px" }}>Mi ruta de formalización</h1>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Pasos personalizados para crecer y acceder a más oportunidades</p>

      {/* Score card */}
      <div style={{ background: "linear-gradient(135deg,#1A1A2E,#185FA5)", borderRadius: 20, padding: "2rem", marginBottom: 24, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 13, opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Score de formalización</p>
            <h2 style={{ margin: "0 0 4px", fontSize: 52, fontWeight: 900 }}>{score}<span style={{ fontSize: 24 }}>/100</span></h2>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>{completados} de {pasos.length} pasos completados</p>
          </div>
          <div style={{ width: 100, height: 100, borderRadius: "50%", border: "8px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <svg viewBox="0 0 36 36" width="100" height="100" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"/>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0F9B8E" strokeWidth="3" strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 22, fontWeight: 900 }}>{score}%</span>
          </div>
        </div>
        <div style={{ marginTop: 16, height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3 }}>
          <div style={{ height: "100%", width: `${score}%`, background: "#0F9B8E", borderRadius: 3, transition: "width 1s" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Pasos */}
        <div>
          <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Tus pasos pendientes</h3>
          {pasos.map((paso, i) => (
            <div key={paso.id} style={{ display: "flex", gap: 12, padding: "14px 16px", background: "#fff", borderRadius: 12, border: paso.done ? "1px solid #4CAF5030" : "1px solid #EAEAEA", marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: paso.done ? "#4CAF50" : "#F8F9FA", border: paso.done ? "none" : "2px solid #D8DDE5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: paso.done ? "#fff" : "#666", fontWeight: 700, fontSize: 13 }}>
                {paso.done ? "✓" : i + 1}
              </div>
              <div>
                <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14, color: paso.done ? "#4CAF50" : "#1A1A2E" }}>{paso.titulo}</p>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#666" }}>{paso.desc}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#0F9B8E", fontWeight: 600 }}>→ {paso.accion}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Programas */}
        <div>
          <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Convocatorias activas</h3>
          {programas.map(p => (
            <div key={p.nombre} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 10, borderLeft: `3px solid ${p.color}`, border: `1px solid #EAEAEA`, borderLeftWidth: 3, borderLeftColor: p.color }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 14 }}>{p.nombre}</p>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888" }}>{p.entidad}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#555" }}>{p.desc}</p>
                </div>
                <span style={{ background: p.color + "18", color: p.color, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", marginLeft: 8 }}>{p.plazo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== CLUSTERING VISUAL ====================
function ClustersPage({ allProfiles, user }) {
  const [selectedCluster, setSelectedCluster] = useState(null);
  const clusters = generarClusters(allProfiles.filter(p => p.role !== 'admin'));
  const etapaColors = { "Ideación": "#9C27B0", "Inicio": "#0F9B8E", "Crecimiento": "#4CAF50", "Consolidación": "#185FA5", "Madurez": "#FF9800", "Expansión": "#D85A30" };

  return (
    <div style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, margin: "0 0 4px" }}>Clústeres dinámicos</h1>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Agrupaciones generadas automáticamente · {clusters.length} clústeres activos · {allProfiles.filter(p => p.role !== 'admin').length} empresas</p>

      <div style={{ display: "grid", gridTemplateColumns: selectedCluster ? "1fr 380px" : "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: selectedCluster ? "1fr" : "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {clusters.map(c => {
            const color = clusterColor(c.cluster);
            const isMe = c.cluster === user.cluster;
            return (
              <div key={c.cluster} onClick={() => setSelectedCluster(c)} style={{
                background: "#fff", borderRadius: 16, padding: "1.25rem 1.5rem",
                border: isMe ? `2px solid ${color}` : selectedCluster?.cluster === c.cluster ? `2px solid ${color}` : "1px solid #EAEAEA",
                cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: color }} />
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{c.cluster}</h3>
                    {isMe && <span style={{ fontSize: 10, background: color + "18", color, borderRadius: 10, padding: "2px 8px", fontWeight: 700 }}>TU CLÚSTER</span>}
                  </div>
                  <span style={{ fontSize: 24, fontWeight: 800, color }}>{c.total}</span>
                </div>
                <div style={{ height: 4, background: "#F0F0F0", borderRadius: 2, marginBottom: 10 }}>
                  <div style={{ height: "100%", width: `${c.avgCompletitud}%`, background: color, borderRadius: 2 }} />
                </div>
                <p style={{ margin: "0 0 10px", fontSize: 12, color: "#888" }}>Completitud promedio: {c.avgCompletitud}%</p>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {Object.entries(c.etapas).slice(0, 3).map(([etapa, count]) => (
                    <span key={etapa} style={{ fontSize: 10, background: (etapaColors[etapa] || "#888") + "18", color: etapaColors[etapa] || "#888", borderRadius: 10, padding: "2px 8px", fontWeight: 600 }}>{etapa}: {count}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {selectedCluster && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: "1px solid #EAEAEA", position: "sticky", top: 80, maxHeight: "80vh", overflowY: "auto" }}>
            <button onClick={() => setSelectedCluster(null)} style={{ float: "right", background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>×</button>
            <h3 style={{ margin: "0 0 4px", fontSize: 18 }}>{selectedCluster.cluster}</h3>
            <p style={{ color: "#888", fontSize: 13, margin: "0 0 16px" }}>{selectedCluster.total} empresas · {selectedCluster.municipios.length} municipios</p>

            <div style={{ background: "#F8F9FA", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
              <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: 13 }}>¿Por qué perteneces a este clúster?</p>
              <p style={{ margin: 0, fontSize: 13, color: "#555" }}>
                {selectedCluster.cluster === user.cluster
                  ? `Tu negocio fue clasificado aquí porque tu sector principal es "${user.cluster}". El clúster agrupa empresas con actividades económicas similares en el Magdalena.`
                  : `Este clúster agrupa ${selectedCluster.total} empresas del sector ${selectedCluster.cluster} en el Magdalena.`}
              </p>
            </div>

            <p style={{ fontWeight: 600, fontSize: 13, margin: "0 0 10px" }}>Distribución por etapa</p>
            {Object.entries(selectedCluster.etapas).map(([etapa, count]) => (
              <div key={etapa} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: etapaColors[etapa] || "#888", fontWeight: 600 }}>{etapa}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{count}</span>
                </div>
                <div style={{ height: 4, background: "#F0F0F0", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${Math.round((count/selectedCluster.total)*100)}%`, background: etapaColors[etapa] || "#888", borderRadius: 2 }} />
                </div>
              </div>
            ))}

            <p style={{ fontWeight: 600, fontSize: 13, margin: "16px 0 10px" }}>Empresas en este clúster</p>
            {selectedCluster.miembros.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 0", borderBottom: "1px solid #F5F5F5" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: clusterColor(m.cluster) + "18", border: `1.5px solid ${clusterColor(m.cluster)}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: clusterColor(m.cluster), flexShrink: 0 }}>
                  {getInitials(m.razon_social)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: m.id === user.id ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {m.razon_social} {m.id === user.id && "👈 Tú"}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{m.municipio} · {m.etapa}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [screen, setScreen] = useState("loading");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Inicio");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("rutac_dark") === "1");
  const [allProfiles, setAllProfiles] = useState([]);

  const toggleDark = () => setDarkMode(d => {
    const next = !d;
    localStorage.setItem("rutac_dark", next ? "1" : "0");
    return next;
  });

  // Load all profiles for AI engine
  const loadAllProfiles = async () => {
    const { data } = await supabase.from("perfiles").select("*");
    if (data) setAllProfiles(data);
  };

  useEffect(() => {
    // Check active Supabase session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: perfil } = await supabase
          .from("perfiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        const u = { ...perfil, id: session.user.id, email: session.user.email, razonSocial: perfil?.razon_social || session.user.user_metadata?.razon_social || "Usuario", role: perfil?.role || session.user.user_metadata?.role || "user" };
        setUser(u);
        saveCurrent(u);
        setScreen("app");
        loadAllProfiles();
      } else {
        setScreen("login");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        clearCurrent();
        setUser(null);
        setScreen("login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (u) => {
    // Normalize field names (Supabase uses snake_case)
    const normalized = { ...u, razonSocial: u.razonSocial || u.razon_social };
    setUser(normalized);
    saveCurrent(normalized);
    setScreen("app");
    setPage("Inicio");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    clearCurrent();
    setUser(null);
    setScreen("login");
  };

  if (screen === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: base.fontFamily, color: "#888" }}>
      Cargando...
    </div>
  );
  if (screen === "login") return <LoginPage onLogin={login} onRegister={() => setScreen("register")} darkMode={darkMode} onToggleDark={toggleDark} />;
  if (screen === "register") return <RegisterPage onDone={login} onLogin={() => setScreen("login")} />;

  const isAdmin = user?.role === "admin" || user?.email === "camara@rutac.gov.co";
  if (isAdmin) return <AdminDashboard onLogout={logout} user={user} />;

  const pages = {
    "Inicio": <InicioPage user={user} onNavigate={setPage} />,
    "Recomendaciones": <RecomendacionesIAPage user={user} allProfiles={allProfiles} onNavigate={setPage} />,
    "Mi clúster": <ClustersPage allProfiles={allProfiles} user={user} />,
    "Conexiones": <ConexionesPage user={user} />,
    "Marketplace": <MarketplacePage user={user} allProfiles={allProfiles} />,
    "Formalización": <FormalizaciónPage user={user} setUserGlobal={u => setUser(u)} />,
    "Mi negocio": <MiNegocioPage user={user} setUserGlobal={u => { setUser(u); saveCurrent(u); }} />,
  };

  return (
    <div style={{ fontFamily: base.fontFamily, minHeight: "100vh", background: "#F5F7FA" }}>
      <Navbar user={user} page={page} setPage={setPage} onLogout={logout} />
      <div>
        {pages[page] || <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>Página no encontrada</div>}
      </div>
    </div>
  );
}