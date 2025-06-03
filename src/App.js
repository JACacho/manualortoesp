



/* global __firebase_config, __initial_auth_token */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Helper function to generate placeholder image URLs
const generateImageUrl = (width, height, bgColor, textColor, text) => {
  return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${text}`;
};

// Define the orthography content based on the provided text
const orthographyContent = [
  {
    unit: "Unidad II",
    title: "Ortografía consonántica: B y V",
    description: "Explora las reglas fundamentales para el uso correcto de las letras 'B' y 'V' en español, incluyendo excepciones y ejemplos prácticos.",
    fixedImageUrl: 'ortografia-b-v.jpg', // Image for this unit
    sections: [
      {
        sectionTitle: "2.1. Reglas para el uso de la “B”",
        rules: [
          {
            rule: "Se escriben con B los verbos terminados en -bir, excepto hervir, servir, vivir y sus compuestos.",
            examples: ["escribir", "subir", "recibir"],
            exercise: "Completa la palabra: conce___ir",
            solution: "concebir",
            explanation: "Esta regla es fundamental para el uso de la *B*. Indica que la mayoría de los verbos que terminan en *-bir* se escriben con *B*. Las excepciones son *hervir*, *servir*, *vivir* y todos los verbos que se forman a partir de ellos (como *convivir*, *revivir*, *supervivir*). Por ejemplo, *escribir* (con B) pero *vivir* (con V)."
          },
          {
            rule: "Se escriben con B los verbos beber, caber, Deber, Haber, Saber.",
            examples: ["beber", "caber", "deber", "haber", "saber"],
            exercise: "Completa la palabra: Yo ___o que es importante.",
            solution: "sé",
            explanation: "Estos cinco verbos son irregulares y se escriben siempre con *B* en todas sus formas conjugadas. Es una regla de memorización directa. Por ejemplo, 'yo *bebo*', 'ellos *saben*'."
          },
          {
            rule: "Se escriben con B los tiempos pasados terminados en Ba, Bas, Bamos, Bais, Ban.",
            examples: ["Amábamos", "Cantábamos", "Íbamos"],
            exercise: "Completa la palabra: Ellos juda___an en el parque.",
            solution: "jugaban",
            explanation: "Esta regla se refiere a las terminaciones del pretérito imperfecto de indicativo de los verbos de la primera conjugación (*-ar*) y del verbo *ir*. Siempre que veas estas terminaciones, la palabra se escribirá con *B*. Por ejemplo, 'nosotros *cantábamos*', 'tú *jugabas*'."
          },
          {
            rule: "Se escriben con B las terminadas en Bilidad, Bundo/a, excepto Movilidad y Civilidad.",
            examples: ["amabilidad", "posibilidad", "vagabundo"],
            exercise: "Completa la palabra: La responsa___ilidad es clave.",
            solution: "responsabilidad",
            explanation: "Los sustantivos que terminan en *-bilidad* (excepto *movilidad* y *civilidad*) y los adjetivos que terminan en *-bundo* o *-bunda* siempre se escriben con *B*. Ejemplos son *sensibilidad*, *moribundo*."
          },
          {
            rule: "Se escriben con B las palabras donde una consonante precede a la B.",
            examples: ["Abnegación", "Abdicar", "Obtener"],
            exercise: "Completa la palabra: Su actitud fue o___via.",
            solution: "obvia",
            explanation: "Esta regla es muy útil: si antes de la *B* hay otra consonante (como *d*, *b*, *s*, *t*, *r*, *l*), la palabra se escribe con *B*. Ejemplos comunes incluyen *subrayar*, *obtuso*, *absoluto*."
          },
          {
            rule: "Se escriben con B todos los derivados y compuestos de Barco.",
            examples: ["Embarcar", "Embarcarse", "Embarcamos"],
            exercise: "Completa la palabra: Vamos a ___arcar el equipaje.",
            solution: "embarcar",
            explanation: "Cualquier palabra que provenga de 'barco' o que lo contenga como raíz se escribirá con *B*. Esto incluye verbos como *embarcar* y sustantivos como *embarcación*."
          },
          {
            rule: "Se escriben con B el tiempo pasado del verbo Ir.",
            examples: ["Iba", "Íbamos", "Iban"],
            exercise: "Completa la palabra: Yo ___a a la escuela todos los días.",
            solution: "iba",
            explanation: "Aunque el verbo *ir* se escribe con *I*, sus formas en pretérito imperfecto de indicativo siempre se escriben con *B*. Por ejemplo, 'ellos *iban* al mercado', 'nosotros *íbamos* a jugar'."
          },
          {
            rule: "Se escriben con B las sílabas Bla, Ble, Bli, Blo, Blu, Bra, Bre, Bri, Bro, Bru.",
            examples: ["blanco", "cable", "libro", "brazo", "cobro"],
            exercise: "Completa la palabra: El ___anco es un color.",
            solution: "blanco",
            explanation: "Esta regla se refiere a las sílabas que contienen las combinaciones *bl-* y *br-*. Siempre se escriben con *B*. Ejemplos adicionales son *pueblo*, *nombre*, *bruja*."
          },
          {
            rule: "Se escriben con B los compuestos de Bi, Bis, Biz (doble).",
            examples: ["binomio", "Bicampeón", "Bípedo"],
            exercise: "Completa la palabra: Un ___cicleta tiene dos ruedas.",
            solution: "bicicleta",
            explanation: "Los prefijos *bi-*, *bis-* y *biz-* significan 'dos' o 'dos veces' y siempre se escriben con *B*. Ejemplos incluyen *bicolor*, *bisabuelo*, *bizcocho*."
          },
          {
            rule: "Se escriben con B las palabras que empiezan por Ban, Abo, Bu, Bur, Bus, Ab, Obs, Sub, Tri, Tur, Nu, Su, Cu, Ca, Al, excepto Trivial, Cavar, Caverna, Cavilar, Cavidad.",
            examples: ["bandera", "abogado", "búho", "buscar", "submarino"],
            exercise: "Completa la palabra: El ___zón es un ave nocturna.",
            solution: "búho",
            explanation: "Esta es una regla amplia para prefijos y sílabas iniciales. Es importante recordar las excepciones para evitar errores. Otros ejemplos son *abuelo*, *observar*, *subir*, *tribu*."
          },
          {
            rule: "Se usa M antes de B.",
            examples: ["Hombre", "Hombría", "Cambio"],
            exercise: "Completa la palabra: El ___ar está tranquilo.",
            solution: "mar",
            explanation: "Esta es una regla de ortografía muy consistente en español: la letra *M* siempre precede a la *B*. Nunca verás *NB* en español. Ejemplos adicionales son *también*, *embudo*, *sombra*."
          }
        ]
      },
      {
        sectionTitle: "2.2. Reglas para el uso de la “V”",
        rules: [
          {
            rule: "Se usa V después de Ad, Ol.",
            examples: ["Advertencia", "Advenedizo", "Olvida", "Disolve"],
            exercise: "Completa la palabra: Él no pudo resol___er el problema.",
            solution: "resolver",
            explanation: "Después de las sílabas *ad-* y *ol-*, se escribe *V*. Esta es una regla común para palabras como *adverbio*, *olvidar*, *resolver*."
          },
          {
            rule: "Se escriben con V los adjetivos terminados en Ava, Ave, Avo, Eve, Evo, Iva, Ivo, exceptuando Árabe, Concebir, Recibir, Percibir y sus derivados, y Arriba, Derriba.",
            examples: ["suave", "bravo", "nueva", "activo", "comprensivo"],
            exercise: "Completa la palabra: Es una persona creati___a.",
            solution: "creativa",
            explanation: "Muchos adjetivos con estas terminaciones se escriben con *V*. Las excepciones son importantes de recordar. Ejemplos adicionales son *grave*, *breve*, *curativo*."
          },
          {
            rule: "Se escriben con V el pasado del verbo Ir (Anduvo, Estuvo, Sostuve).",
            examples: ["Anduvo", "Estuvo", "Sostuve"],
            exercise: "Completa la palabra: Él ___o en casa todo el día.",
            solution: "estuvo",
            explanation: "Las formas de pretérito perfecto simple de los verbos *andar*, *estar* y *tener* (y sus derivados) se escriben con *V*. Por ejemplo, 'yo *anduve*', 'tú *tuviste*'."
          },
          {
            rule: "Se escriben con V las voces que empiezan con Vice, Villa.",
            examples: ["vicepresidente", "villano", "villancico"],
            exercise: "Completa la palabra: El ___alcalde asistió a la reunión.",
            solution: "vicealcalde",
            explanation: "Los prefijos *vice-* (que indica 'en lugar de') y *villa-* (relacionado con 'pueblo' o 'casa de campo') siempre se escriben con *V*. Ejemplos son *vicerrector*, *villancico*."
          },
          {
            rule: "Se escriben con V las palabras terminadas en Viro, Vira, ívoro, ívora, excepto Víbora.",
            examples: ["carnívoro", "herbívoro", "elvira"],
            exercise: "Completa la palabra: El león es un animal carní___oro.",
            solution: "carnívoro",
            explanation: "Las palabras que terminan en *-viro*, *-vira*, *-ívoro* o *-ívora* (que a menudo se refieren a la alimentación) se escriben con *V*. La única excepción común es *víbora*."
          },
          {
            rule: "Se escriben con V los derivados y compuestos de Revivir.",
            examples: ["revivir", "revivió", "reviviremos"],
            exercise: "Completa la palabra: Ella ___ió después del susto.",
            solution: "revivió",
            explanation: "Todas las formas verbales y sustantivos que provienen de *revivir* se escriben con *V*. Esto aplica a *revivió*, *reviviremos*, *reviviendo*, etc."
          },
          {
            rule: "Se escriben con V palabras que contengan Voca, Serva, exceptuando Boca y sus derivados.",
            examples: ["Revocado", "Conservaron", "invocar"],
            exercise: "Completa la palabra: Debemos con___ar la energía.",
            solution: "conservar",
            explanation: "Las palabras que contienen las secuencias *voca-* (excepto *boca*) y *serva-* se escriben con *V*. Ejemplos son *convocar*, *observar*, *reservar*."
          },
          {
            rule: "Se escriben con V las palabras que empiezan por Ven, Ver, Ves, exceptuando las palabras que se compongan de Bene (bueno).",
            examples: ["venir", "verdad", "vestido", "ventana"],
            exercise: "Completa la palabra: La ___dad siempre sale a la luz.",
            solution: "verdad",
            explanation: "Esta regla cubre muchas palabras que comienzan con *ven-*, *ver-* o *ves-*. Las excepciones son palabras que derivan de *bene-* (que significa 'bien' o 'bueno'), como *beneficio*."
          },
          {
            rule: "Se escriben con V los derivados en tiempo pasado de Tener, Estar, Andar.",
            examples: ["Anduve", "Anduviste", "tuve", "Tuviese"],
            exercise: "Completa la palabra: Yo ___e que irme temprano.",
            solution: "tuve",
            explanation: "Las formas de pretérito perfecto simple de los verbos *tener*, *estar* y *andar* (y sus compuestos) se escriben con *V*. Por ejemplo, *contuve*, *detuve*, *estuvimos*."
          },
          {
            rule: "Se usa N antes de V.",
            examples: ["envidia", "invierno", "convenir"],
            exercise: "Completa la palabra: En el ___ierno hace frío.",
            solution: "invierno",
            explanation: "Similar a la regla de *M* antes de *B*, la letra *N* siempre precede a la *V* en español. Nunca verás *NV* en español. Ejemplos adicionales son *enviar*, *conversar*, *invitar*."
          }
        ]
      },
      {
        sectionTitle: "2.3. Diferencias entre la “B” y la “V”",
        rules: [
          {
            rule: "La diferencia en el uso de B y V se manifiesta en palabras que suenan igual pero tienen distinto significado (homófonos), algunas de las cuales se diferencian por estas letras.",
            examples: [
              "Bello (Hermoso) / vello (Pelo corto y fino)",
              "Vasto (territorio amplio) / Basto (sin refinamiento)",
              "Botar (Echar, rebotar) / votar (Dar voto)",
              "Basar (fundamentar) / vasar (estante)",
              "Bienes (riquezas) / vienes (del verbo venir)"
            ],
            exercise: "El ___o del gato es suave. (bello/vello)",
            solution: "vello",
            explanation: "Los homófonos son palabras que suenan igual pero tienen significados y a menudo escrituras diferentes. La *B* y la *V* son causa común de homófonos en español, como en los ejemplos proporcionados. Es crucial conocer el significado para escribir correctamente."
          }
        ]
      }
    ]
  },
  {
    unit: "Unidad III",
    title: "Ortografía consonántica (S, C, X, Z, G y J)",
    description: "Domina las complejas reglas de las letras 'S', 'C', 'X', 'Z', 'G' y 'J', con énfasis en sus diferentes sonidos y aplicaciones.",
    fixedImageUrl: 'ortografia-s-c-x-z-g-j.jpg', // Image for this unit
    sections: [
      {
        sectionTitle: "3.1.1. Reglas para el uso de la “C”",
        rules: [
          {
            rule: "La C tiene dos sonidos: parecido a la Z (antes de E, I) y parecido a la K (antes de A, O, U, C, L, R, T).",
            examples: ["Cereza", "Cielito", "casa", "Cuba", "Coseno", "aclamo", "cráter", "técnico", "Acción", "Perfección"],
            exercise: "Pronuncia y escribe: ___asa (sonido K)",
            solution: "casa",
            explanation: "La letra *C* es versátil en español. Suena como *Z* (o *S* en seseo) antes de *e* o *i* (ej. *cena*, *cine*). Suena como *K* antes de *a*, *o*, *u* (ej. *casa*, *cosa*, *cuna*) y antes de consonantes (ej. *claro*, *crema*). Es importante reconocer su sonido según la vocal que la sigue."
          },
          {
            rule: "Se escriben con C las palabras que terminan en Ancia/o, Acia/o, excepto Ansia, Asia, Gimnasia, Potasio.",
            examples: ["elegancia", "fragancia", "gracia", "espacio"],
            exercise: "Completa la palabra: La importan___a de la educación.",
            solution: "importancia",
            explanation: "Muchos sustantivos que denotan cualidades, estados o acciones terminan en *-ancia* o *-acia* y se escriben con *C*. Las excepciones son nombres propios o palabras de origen diferente. Ejemplos adicionales son *constancia*, *democracia*."
          },
          {
            rule: "Se escriben con C los diminutivos que terminan en Ica/o, Illa/o, Ita/o, excepto Casilla, Cursillo, Bolsillo, Risita, Salsita, Cosita, Mansito, Besito.",
            examples: ["corazoncito", "algodoncito", "panecito", "hombrecito"],
            exercise: "Completa la palabra: Un perrito pequeñi___o.",
            solution: "pequeñito",
            explanation: "Los diminutivos que terminan en *-cito*, *-cita*, *-cillo*, *-cilla* se escriben con *C*. Es una forma común de expresar tamaño pequeño o afecto. Ejemplos: *florcita*, *arbolcillo*."
          },
          {
            rule: "Se escriben con C las palabras terminadas en Icia,/e/o, excepto derivados de Lisiar y el nombre Dionicio.",
            examples: ["justicia", "superficie", "servicio"],
            exercise: "Completa la palabra: La noti___ia es sorprendente.",
            solution: "noticia",
            explanation: "Sustantivos que terminan en *-icia*, *-icie*, *-icio* se escriben con *C*. A menudo se refieren a cualidades, profesiones o lugares. Ejemplos: *malicia*, *ejercicio*, *beneficio*."
          },
          {
            rule: "Se escribe con C el plural de las palabras terminadas en Z.",
            examples: ["Pez, Peces", "lápiz, lápices", "codorniz, codornices", "lombriz, lombrices"],
            exercise: "El plural de 'luz' es lu___es.",
            solution: "luces",
            explanation: "Cuando una palabra singular termina en *Z*, su plural cambia la *Z* por *C* antes de añadir *-es*. Esta es una regla de formación de plurales muy importante en español. Ejemplos: *cruz* -> *cruces*, *voz* -> *voces*."
          },
          {
            rule: "Se escriben con C los verbos terminados en Cer, Ceder, Cender, Cir, Cibir, Cidir, excepto Presidir, residir.",
            examples: ["conocer", "proceder", "encender", "decir", "recibir", "decidir"],
            exercise: "Completa la palabra: Él va a cono___er la verdad.",
            solution: "conocer",
            explanation: "Esta regla agrupa muchos verbos que terminan en estas secuencias. Es importante memorizarlas para asegurar la correcta escritura. Ejemplos: *crecer*, *conceder*, *lucir*, *percibir*."
          },
          {
            rule: "Se escriben con C los verbos terminados en Cimiento derivados de verbos terminados en Cer, Cir.",
            examples: ["Florecer, Florecimiento", "nacer, nacimiento"],
            exercise: "El ___cimiento del sol es hermoso.",
            solution: "nacimiento",
            explanation: "Los sustantivos que se forman a partir de verbos terminados en *-cer* o *-cir* y que expresan la acción o el resultado de esa acción, se escriben con *-cimiento*. Ejemplos: *establecer* -> *establecimiento*, *agradecer* -> *agradecimiento*."
          },
          {
            rule: "Palabras comunes con doble C.",
            examples: ["Reducción", "Restricción", "Aflicción", "Accidente", "Infección", "Diccionario"],
            exercise: "Completa la palabra: La ___ción es importante.",
            solution: "acción",
            explanation: "Algunas palabras en español contienen una doble *C* (*cc*), donde la primera *C* a menudo suena como *k* y la segunda como *z* (o *s* en seseo). Esto ocurre en palabras derivadas de otras con *ct*. Ejemplos: *lector* -> *lección*, *perfecto* -> *perfección*."
          },
          {
            rule: "La terminación en -ción/sión deriva a menudo de participios en -ado, -ido.",
            examples: ["Atento > Atención", "Descrito > Descripción", "Inv---to > Invención", "Compuesto > Composición", "Comunicado > Comunicación", "Conservado > Conservación", "Meditado > Meditación"],
            exercise: "Transforma 'educado' a sustantivo: Educa___",
            solution: "Educación",
            explanation: "Esta regla ayuda a distinguir entre *-ción* (con *C*) y *-sión* (con *S*). Si el participio del verbo relacionado termina en *-ado* o *-ido*, el sustantivo derivado a menudo termina en *-ción*. Ejemplos: *creado* -> *creación*, *agotado* -> *agotación*."
          }
        ]
      },
      {
        sectionTitle: "3.1.2. Reglas para el uso de la “S”",
        rules: [
          {
            rule: "Se escriben con S las palabras terminadas en Ersa/e/o, Esta/o, Osa/o, Ísimo/a, Sión, Ésimo, Sible, Sivo, Sor.",
            examples: ["Propenso", "agresivo", "abrasiva", "orquesta", "resto", "listo", "prestamista", "propulsión", "diversión", "conversión", "distorsión", "emulsión", "expulsión", "Sucesión", "cohesión", "opresión", "misión", "transmisión", "intromisión", "bellísimo"],
            exercise: "Completa la palabra: Es una persona curio___a.",
            solution: "curiosa",
            explanation: "Estas terminaciones son muy comunes en adjetivos y sustantivos. Memorizar estas terminaciones ayuda a escribir correctamente palabras como *inverso*, *majestuoso*, *grandísimo*, *comprensivo*."
          },
          {
            rule: "Se usa S en palabras que indican oficio o dignidades femeninas terminadas en Esa, Isa.",
            examples: ["Poetisa", "Marquesa", "princesa"],
            exercise: "Completa la palabra: La conde___a llegó tarde.",
            solution: "condesa",
            explanation: "Los sustantivos femeninos que indican oficios o dignidades y que terminan en *-esa* o *-isa* se escriben con *S*. Ejemplos: *condesa*, *sacerdotisa*, *profetisa*."
          },
          {
            rule: "Se usa S en terminaciones ES de adjetivos gentilicios.",
            examples: ["Dinamarqués", "Francés", "Portugués", "londinense", "jalisciense", "aragonés", "genovesa"],
            exercise: "Completa la palabra: Él es inglé___.",
            solution: "inglés",
            explanation: "Los adjetivos que indican origen o nacionalidad y que terminan en *-és* (masculino) o *-esa* (femenino) se escriben con *S*. Ejemplos: *japonés*, *francesa*, *irlandés*."
          },
          {
            rule: "Se usa S en todos los plurales.",
            examples: ["mes, meses", "res, reses", "revés, reveses", "siamés, siameses"],
            exercise: "El plural de 'flor' es flore___.",
            solution: "flores",
            explanation: "Esta es una regla básica de formación de plurales en español: la mayoría de los sustantivos y adjetivos forman su plural añadiendo *-s* o *-es*. Ejemplos: *casa* -> *casas*, *árbol* -> *árboles*."
          },
          {
            rule: "Se escriben con S las que terminan en sis.",
            examples: ["hipótesis", "hipnosis", "mitosis", "cirrosis", "análisis", "génesis"],
            exercise: "Completa la palabra: La crí___is económica.",
            solution: "crisis",
            explanation: "Muchos sustantivos de origen griego que terminan en *-sis* se escriben con *S*. A menudo se refieren a procesos o estados. Ejemplos: *tesis*, *parálisis*, *síntesis*."
          },
          {
            rule: "Se escribe la terminación sión si está precedida por las sílabas MI, o las consonantes L, R, la vocal E o la sílaba COM.",
            examples: ["propulsión", "diversión", "conversión", "distorsión", "emulsión", "expulsión", "Sucesión", "cohesión", "opresión", "misión", "transmisión", "intromisión"],
            exercise: "Completa la palabra: La deci___ión fue difícil.",
            solution: "decisión",
            explanation: "Esta regla ayuda a distinguir entre *-sión* y *-ción*. Si la palabra base pierde la *d* o la *t* al formar el sustantivo, o si proviene de verbos terminados en *-der*, *-dir*, *-sar*, a menudo lleva *S*. Ejemplos: *dividir* -> *división*, *expresar* -> *expresión*."
          }
        ]
      },
      {
        sectionTitle: "3.1.3. Reglas para el uso de la “X”",
        rules: [
          {
            rule: "Se escribe con X en las palabras compuestas del prefijo EX o EXTRA (que significan “fuera de”), de lo contrario se escriben con S.",
            examples: ["Extraer", "explanada", "expulsar", "excelente"],
            exercise: "Completa la palabra: ___traordinario.",
            solution: "extraordinario",
            explanation: "Los prefijos *ex-* y *extra-* indican 'fuera de', 'más allá' o 'que ya no es'. Se escriben con *X*. Es crucial no confundirlos con palabras que simplemente empiezan con *es-* y no tienen este significado. Ejemplos: *exalumno*, *extravagante*, *exclusivo*."
          },
          {
            rule: "También llevan X, las palabras que le siguen una H, o bien pla, ple, pli, plo, plu.",
            examples: ["exhalar", "explicar", "explosión", "explorar"],
            exercise: "Completa la palabra: ___plorar un nuevo lugar.",
            solution: "explorar",
            explanation: "Esta es una regla específica para las combinaciones *xh-* y *xp-*. Si una palabra contiene *xh* (ej. *exhibir*) o *xp* (ej. *explotar*), se escribe con *X*. Ejemplos: *exhausto*, *explicación*."
          },
          {
            rule: "La X tiene los fonemas /ks/ y /s/, y el fonema /x/ en palabras como 'México'.",
            examples: ["examen", "texto", "xilófono", "México"],
            exercise: "Escribe una palabra con X que suene como /s/.",
            solution: "xilófono",
            explanation: "La *X* en español puede tener varios sonidos. El más común es /ks/ (como en *examen*, *texto*). En algunas palabras de origen náhuatl o nombres propios, puede sonar como /s/ (ej. *xilófono*, *Xochimilco*) o incluso como /j/ (como en *México*, *Texas*)."
          }
        ]
      },
      {
        sectionTitle: "3.1.4. Diferencias entre la “C”, la “S” y la “X”",
        rules: [
          {
            rule: "Las diferencias en el uso de C, S, y X se basan en reglas específicas para cada letra y en fenómenos fonéticos como el seseo (pronunciación de Z y C antes de e/i como S). La distinción se aplica en plurales, terminaciones y derivadas, y a veces en palabras que suenan parecido o igual (homófonos).",
            examples: [
              "Plural de Z: pez, peces vs plural de S: mes, meses.",
              "Terminación de gentilicio en S: Francés vs plural de Z en C: lápiz, lápices.",
              "Terminación -sión (con S) vs -ción (con C).",
              "Reglas para Z ante A, O, U (Zapatero) vs Reglas para C ante A, O, U (casa).",
              "Uso de X en extra- (Extraer) vs S (salida)."
            ],
            exercise: "Corrige si es necesario: 'La desicion fue correcta.'",
            solution: "La decisión fue correcta.",
            explanation: "Distinguir entre *C*, *S* y *X* es un desafío común. Se basa en reglas de terminación (como *-ción* vs. *-sión*), formación de plurales (*Z* a *C*), prefijos (*ex-*) y el sonido de la *C* según la vocal que la sigue. La práctica y el conocimiento de las reglas son clave."
          }
        ]
      },
      {
        sectionTitle: "3.1.5. Reglas para el uso de la “Z”",
        rules: [
          {
            rule: "Se escribe con Z al final de una sílaba.",
            examples: ["paz", "luz", "feliz", "arroz"],
            exercise: "Completa la palabra: La ___paz de la noche.",
            solution: "paz",
            explanation: "La *Z* se usa al final de sílaba cuando el sonido es /θ/ (o /s/ en seseo) y no hay vocal que la siga en esa sílaba. Ejemplos: *capaz*, *audaz*, *cruz*."
          },
          {
            rule: "Se escribe con Z al final de palabra.",
            examples: ["Tapiz", "Perdiz", "capaz", "feliz"],
            exercise: "Completa la palabra: Es un hombre capa___.",
            solution: "capaz",
            explanation: "Muchas palabras que terminan con el sonido /θ/ (o /s/) al final de la palabra se escriben con *Z*. Ejemplos: *lápiz*, *nariz*, *voz*."
          },
          {
            rule: "Para distinguir D y Z al final de palabra, formar el plural: si termina en -CES, el singular es Z; si termina en -DES, el singular es D.",
            examples: ["Perdiz (Perdices)", "Césped (Céspedes)", "pared (paredes)"],
            exercise: "El singular de 'cruces' es cru___.",
            solution: "cruz",
            explanation: "Esta es una regla muy útil para saber si una palabra termina en *D* o *Z*. Si al formar el plural la terminación es *-ces*, el singular lleva *Z*. Si la terminación es *-des*, el singular lleva *D*. Ejemplos: *ciudad* -> *ciudades*, *actriz* -> *actrices*."
          },
          {
            rule: "Se escribe con Z antes de A, O, U.",
            examples: ["Zurdo", "Zapatero", "cruzar", "pozo"],
            exercise: "Completa la palabra: Un ___apato nuevo.",
            solution: "zapato",
            explanation: "La *Z* se usa antes de las vocales *a*, *o*, *u* para representar el sonido /θ/ (o /s/). Ejemplos: *azul*, *zorro*, *azúcar*."
          },
          {
            rule: "Se escriben con Z las palabras terminadas en Azo (indican golpe).",
            examples: ["Mazazo", "Flechazo", "portazo", "golpazo"],
            exercise: "Completa la palabra: Le dio un puñeta___o.",
            solution: "puñetazo",
            explanation: "El sufijo *-azo* se usa para formar aumentativos o para indicar un golpe. Cuando se refiere a un golpe, siempre se escribe con *Z*. Ejemplos: *cabezazo*, *martillazo*."
          },
          {
            rule: "Se escriben con Z las palabras aumentativas terminadas en Aza/o.",
            examples: ["Piernaza", "Manaza", "mujeraza", "librazo"],
            exercise: "Completa la palabra: Qué libra___o tan grande.",
            solution: "librazo",
            explanation: "Los aumentativos que terminan en *-azo* o *-aza* (que no indican golpe) se escriben con *Z*. Ejemplos: *casaza*, *perrazo*."
          },
          {
            rule: "Se escriben con Z los sustantivos terminados en -izo, -iza (que indican tendencia o finalidad).",
            examples: ["resbaladizo", "enfermiza", "cobrizo"],
            exercise: "Completa la palabra: Es un camino resbalad___o.",
            solution: "resbaladizo",
            explanation: "Los adjetivos y sustantivos que terminan en *-izo* o *-iza* y que expresan una cualidad o tendencia se escriben con *Z*. Ejemplos: *antojadizo*, *rojizo*."
          },
          {
            rule: "Se escriben con Z los sustantivos abstractos terminados en -ez y -eza, que provienen de adjetivos.",
            examples: ["belleza (de bello)", "rapidez (de rápido)", "tristeza (de triste)", "honradez (de honrado)"],
            exercise: "El sustantivo abstracto de 'pobre' es pobre___a.",
            solution: "pobreza",
            explanation: "Muchos sustantivos abstractos que se forman a partir de adjetivos y que terminan en *-ez* o *-eza* se escriben con *Z*. Ejemplos: *delicadeza*, *timidez*, *grandeza*."
          },
          {
            rule: "Se escriben con Z los verbos terminados en -izar (que derivan de sustantivos o adjetivos) en sus formas conjugadas cuando el sonido se mantiene.",
            examples: ["analizar > analizo", "realizar > realizo", "homogeneizar > homogeneízo"],
            exercise: "Completa la palabra: Voy a organi___ar mi tiempo.",
            solution: "organizar",
            explanation: "Los verbos que terminan en *-izar* (que significa 'convertir en' o 'hacer') se escriben con *Z* en el infinitivo y en sus conjugaciones donde el sonido se mantiene. Ejemplos: *civilizar*, *aterrizar*, *normalizar*."
          },
          {
            rule: "Los verbos terminados en -zar se escriben con Z, así como sus formas conjugadas cuando el sonido se mantiene.",
            examples: ["comenzar > comienzo", "organizar > organizo", "rechazar > rechazo", "Abrazar", "Alcanzar", "Cruzar", "Forzar"],
            exercise: "Completa la palabra: Él comien___a a trabajar.",
            solution: "comienza",
            explanation: "Los verbos cuyo infinitivo termina en *-zar* mantienen la *Z* en sus conjugaciones, siempre que el sonido se preserve. Ejemplos: *gozar*, *alcanzar*, *cazar*."
          },
          {
            rule: "Se usa Z en sustantivos que indican nombres de animales en diminutivo o afectivo.",
            examples: ["perro > perrazo", "gato > gatazo", "pajarrazo"],
            exercise: "El aumentativo de 'coche' es coche___o.",
            solution: "cochezazo",
            explanation: "Aunque no es la regla más común, algunos aumentativos o formas afectivas de nombres de animales pueden usar *Z* (ej. *perrazo*). Sin embargo, es más frecuente ver *-azo* o *-aza* con *Z* en aumentativos de otros sustantivos."
          },
          {
            rule: "Al incorporar palabras extranjeras que contienen la letra Z, es común mantener su grafía original.",
            examples: ["pizza", "jazz", "zigzag"],
            exercise: "Escribe una palabra extranjera con Z.",
            solution: "pizza",
            explanation: "En español, se tiende a respetar la grafía original de las palabras de otros idiomas que contienen la *Z*, especialmente si son de uso extendido. Ejemplos: *zen*, *zebra* (aunque también *cebra*)."
          }
        ]
      },
      {
        sectionTitle: "3.1.6. Reglas para el uso de la “G”",
        rules: [
          {
            rule: "La G tiene dos sonidos: suave (como en Amigo, Glosa, antes de A, O, U) y fuerte (parecido a la J, como en Genio, Giro, antes de E, I).",
            examples: ["Amigo", "Glosa", "Genio", "Giro", "Gato", "Gala", "Gota", "Gusto"],
            exercise: "Escribe una palabra con G de sonido fuerte.",
            solution: "gente",
            explanation: "La *G* tiene un sonido suave (/g/) antes de *a*, *o*, *u* (ej. *gato*, *gorro*, *gusto*) y antes de consonantes (ej. *globo*, *gracias*). Suena fuerte (/x/, como la *J*) antes de *e* o *i* (ej. *gente*, *gigante*). Esta distinción es clave para su uso."
          },
          {
            rule: "Si la G es suave con E o I, se le pone una U en medio (dígrafo GU). La U es muda en este caso.",
            examples: ["Guerra", "Guitarra", "Guía", "Guijarro", "Guiso", "Guerrero", "Guillotina"],
            exercise: "Completa la palabra: La ___itarra suena bien.",
            solution: "guitarra",
            explanation: "Para que la *G* mantenga su sonido suave (/g/) antes de *e* o *i*, se intercala una *U* muda. El conjunto *gu* forma un dígrafo. Ejemplos: *águila*, *juguete*, *seguir*."
          },
          {
            rule: "Al final de la sílaba, fuerte, lleva G.",
            examples: ["Signo", "Ignición", "Magdalena", "Algebraico"],
            exercise: "Completa la palabra: El ___nóstico es bueno.",
            solution: "diagnóstico",
            explanation: "Cuando la *G* aparece al final de una sílaba y tiene un sonido fuerte (como en *digno*), se escribe con *G*. Ejemplos: *magnífico*, *fragmento*."
          },
          {
            rule: "Se escriben con G las palabras que empiezan con Geo.",
            examples: ["Geología", "Geografía", "geometría"],
            exercise: "Completa la palabra: La ___grafía estudia la tierra.",
            solution: "geografía",
            explanation: "El prefijo *geo-* significa 'tierra' y siempre se escribe con *G*. Es común en términos relacionados con las ciencias de la Tierra. Ejemplos: *geólogo*, *geocéntrico*."
          },
          {
            rule: "Se escriben con G las que llevan Gn, Gm.",
            examples: ["Signo", "Ignición", "magnífico", "segmento"],
            exercise: "Completa la palabra: El ___nóstico es bueno.",
            solution: "diagnóstico",
            explanation: "Las palabras que contienen las combinaciones *gn* o *gm* se escriben con *G*. Ejemplos: *digno*, *fragmento*, *magnetismo*."
          },
          {
            rule: "Se escriben con G las que terminan con gia, gio, Gía, gion, gional, gionario, gioso, Gen, Gélico, Genario, Género, Genio, Génito, Gesiman, Gésimo, Gético, Giénico, Gimal, Gíneo, Ginoso, Gismo, ogia, ógico/a, ígeno/a, ígero/a, con sus femeninos y plurales, excepto Aguajinoso, Espejismo, Salvajismo, Bujía, Herejía, Lejía.",
            examples: ["Biología", "Psicología", "Pedagogía", "Demagogia", "octogenario", "homogéneo", "Evangélico", "Energético", "Neuralgia", "Legionario", "Contagioso", "Vertiginoso"],
            exercise: "Completa la palabra: La teolo___ía es una ciencia.",
            solution: "teología",
            explanation: "Esta es una regla muy extensa para terminaciones que indican ciencias, profesiones, cualidades o categorías. La mayoría de estas terminaciones de origen griego se escriben con *G*. Las excepciones son pocas y deben memorizarse."
          },
          {
            rule: "Tiempo pasado terminado en Ger, Gir, Igerar y similares, excepto las que tengan sonido Ja/o y las palabras Tejer, Crujir y derivados.",
            examples: ["proteger", "dirigir", "exagerar", "recoger"],
            exercise: "Completa la palabra: Ellos diri___ieron la reunión.",
            solution: "dirigieron",
            explanation: "Los verbos que terminan en *-ger*, *-gir* o *-igerar* se escriben con *G* en su infinitivo y en sus formas conjugadas, excepto cuando el sonido fuerte de la *J* aparece (ej. *protejo*). Las excepciones *tejer* y *crujir* son importantes."
          },
          {
            rule: "Cuando la U colocada entre la G y una de las vocales E, I, con sonido independiente, llevan dos puntos encima (diéresis).",
            examples: ["Vergüenza", "Pingüino", "Cigüeña", "Antigüedad", "Lingüística", "Desagüe", "Bilingüe", "Agüero", "Ambigüedad"],
            exercise: "Completa la palabra: El ___üino es un ave.",
            solution: "pingüino",
            explanation: "La diéresis (¨) sobre la *U* en las sílabas *güe* y *güi* indica que la *U* debe pronunciarse. Sin la diéresis, la *U* sería muda. Es fundamental para distinguir palabras como *guerra* (U muda) de *vergüenza* (U sonora)."
          },
          {
            rule: "Se escriben con G las palabras que contienen la secuencia INGE.",
            examples: ["Ingeniero", "Ingenio", "Ingenioso", "Ingente", "Ingenuo", "Ingerir", "Ingeniería", "Ingerencia", "Ingeniar"],
            exercise: "Completa la palabra: Es un ___enio.",
            solution: "ingenio",
            explanation: "Las palabras que contienen la secuencia *inge* (especialmente al principio o en el medio) se escriben con *G*. Estas palabras a menudo se relacionan con la inteligencia, la creación o la ingestión."
          },
          {
            rule: "Se escriben con G las que incluyen las sílabas GEN o GES.",
            examples: ["gente", "general", "gesto", "gerente", "ángel", "angelitos"],
            exercise: "Completa la palabra: El ___eneral dio la orden.",
            solution: "general",
            explanation: "Las palabras que contienen las sílabas *gen* o *ges* se escriben con *G*. Esto incluye muchas palabras relacionadas con el origen, la gestión o la gente. Ejemplos: *generar*, *gestionar*, *urgente*."
          },
          {
            rule: "Se escriben con G las que terminan en -gente, -gencia.",
            examples: ["diligente", "indigente", "diligencia", "agencia", "regencia"],
            exercise: "Completa la palabra: La emer___encia fue controlada.",
            solution: "emergencia",
            explanation: "Los sustantivos y adjetivos que terminan en *-gente* o *-gencia* se escriben con *G*. Estas terminaciones a menudo indican una cualidad o una institución. Ejemplos: *inteligente*, *vigencia*."
          }
        ]
      },
      {
        sectionTitle: "3.1.7. Reglas para el uso de la “J”",
        rules: [
          {
            rule: "Se escriben con J las voces fuertes Ja, Jo, Ju, Je, Ji.",
            examples: ["jarra", "joven", "jugar", "ejemplo", "jirafa"],
            exercise: "Completa la palabra: El ___uego es divertido.",
            solution: "juego",
            explanation: "La *J* siempre tiene un sonido fuerte (/x/) en español, independientemente de la vocal que la siga. Es importante no confundirla con la *G* cuando esta tiene sonido fuerte. Ejemplos: *jardín*, *joya*, *justo*."
          },
          {
            rule: "Se escriben con J al final de la sílaba o palabra.",
            examples: ["Reloj", "cajón", "mujer"],
            exercise: "Completa la palabra: El gara___e está sucio.",
            solution: "garaje",
            explanation: "Cuando el sonido /x/ aparece al final de una sílaba o al final de una palabra, se escribe con *J*. Ejemplos: *reloj*, *cajón*, *mensaje*."
          },
          {
            rule: "Se escriben con J las palabras terminadas en Aje, Eje, Jera, Jero.",
            examples: ["Pasaje", "Paisaje", "Coraje", "Eje", "Hereje", "cajera", "relojero"],
            exercise: "Completa la palabra: El mensa___ero llegó tarde.",
            solution: "mensajero",
            explanation: "Las palabras que terminan en *-aje*, *-eje*, *-jera* o *-jero* se escriben con *J*. Estas terminaciones son muy comunes en sustantivos y adjetivos. Ejemplos: *viaje*, *manejo*, *extranjero*."
          },
          {
            rule: "Se escriben con J las palabras Terminadas en Jería.",
            examples: ["conserjería", "brujería", "relojería"],
            exercise: "Completa la palabra: La joye___ía es muy cara.",
            solution: "joyería",
            explanation: "Los sustantivos que terminan en *-jería* se escriben con *J*. A menudo se refieren a lugares o actividades. Ejemplos: *mensajería*, *cerrajería*."
          },
          {
            rule: "Se escriben con J las personas y el verbo en pasado que lleven J.",
            examples: ["Tejía", "Tejeremos", "Dijeron (decir)", "Conduje (conducir)", "traje (traer)"],
            exercise: "Completa la palabra: Ellos produ___eron un gran cambio.",
            solution: "produjeron",
            explanation: "Las formas de los verbos que en su infinitivo no tienen *J* ni *G*, pero que al conjugarse en ciertos tiempos (especialmente pretérito perfecto simple e imperfecto de subjuntivo) adquieren el sonido /x/, se escriben con *J*. Ejemplos: *decir* -> *dije*, *traer* -> *trajiste*."
          },
          {
            rule: "Se escriben con J las que derivan de otras que llevan J.",
            examples: ["caja, Cajita", "Ojar, hoja", "bajar, bajada"],
            exercise: "Completa la palabra: La ___unta de vecinos.",
            solution: "junta",
            explanation: "Si una palabra base se escribe con *J*, sus derivados y familias de palabras también se escribirán con *J*. Ejemplos: *justo* -> *justicia*, *ojo* -> *ojear*."
          },
          {
            rule: "Se escriben con J las palabras que empiezan con eje-.",
            examples: ["ejemplo", "ejercicio", "ejecutar"],
            exercise: "Completa la palabra: Es un buen ___emplo a seguir.",
            solution: "ejemplo",
            explanation: "Las palabras que comienzan con la secuencia *eje-* se escriben con *J*. Ejemplos: *ejecutivo*, *ejército*."
          },
          {
            rule: "Se escriben con J las palabras que empiezan con adj-, obj-.",
            examples: ["adjunto", "adjetivo", "objeto", "objetivo"],
            exercise: "Completa la palabra: El ___eto es importante.",
            solution: "objeto",
            explanation: "Las palabras que comienzan con las secuencias *adj-* u *obj-* se escriben con *J*. Ejemplos: *adjuntar*, *objetivo*."
          }
        ]
      },
      {
        sectionTitle: "3.1.8. Reglas para el uso de la “Y”",
        rules: [
          {
            rule: "Si la palabra que termina con sonido I, lleva acento (tónico o gráfico), se escribe con I; si no lleva acento es con Y.",
            examples: ["rey", "ley", "virrey", "Samurái (con acento)"],
            exercise: "Completa la palabra: El ___ es el soberano.",
            solution: "rey",
            explanation: "Esta regla ayuda a distinguir entre *i* y *y* al final de palabra. Si la sílaba tónica es la última y termina en el sonido /i/, se escribe con *y* si no es una vocal (ej. *rey*). Si la *i* es tónica, se escribe con *i* y tilde (ej. *Samurái*)."
          },
          {
            rule: "Para distinguir Y de LL, formar el singular de la palabra dudosa: si sonoramente termina con I, se escribe con Y; si termina en E, se escribe con LL. Si no termina con ese sonido (I o Y), es porque lleva Y (Ej.: Leer. Leyó).",
            examples: ["Ley (singular de Leyes)", "Calle (singular de Calles)", "Leer, Leyó", "cayó (caer)"],
            exercise: "El singular de 'sillas' es si___a.",
            solution: "silla",
            explanation: "La *Y* y la *LL* son fonemas distintos en algunas regiones, pero en muchas suenan igual (yeísmo). Esta regla ayuda a diferenciarlas por su origen o comportamiento en singular/plural o conjugaciones. Ejemplos: *valla* (cerca) vs. *vaya* (del verbo ir)."
          },
          {
            rule: "Palabras comunes que se escriben con Y.",
            examples: ["Yarará", "Yeso", "Yacer", "yogur", "yema"],
            exercise: "Completa la palabra: El ___ogur es saludable.",
            solution: "yogur",
            explanation: "Existen muchas palabras de uso común que simplemente se escriben con *Y* y no siguen una regla fonética clara. Es importante memorizarlas. Ejemplos: *yate*, *ayuno*, *mayo*."
          }
        ]
      },
      {
        sectionTitle: "3.2. Diferencias entre la “G” y la “J”",
        rules: [
          {
            rule: "La diferencia principal entre G y J radica en su sonido ante las vocales E, I: la G suena fuerte (como J) ante A, O, U y al final de sílaba o ante consonante, pero necesita el dígrafo GU (con U muda) para sonar suave (/g/) ante E, I. La J siempre tiene el sonido fuerte (/x/) ante cualquier vocal. Existen excepciones a las reglas generales de G y J.",
            examples: [
              "Gato (G sonido fuerte) vs. Genio (G sonido fuerte como J).",
              "Guerra (GU con U muda) vs. Jerarca (J sonido fuerte).",
              "Regir (verbo con G) vs. Tejer (verbo excepción con J).",
              "Exagerar (verbo con G) vs. Extranjero (palabra con J).",
              "Biología (palabra con G) vs. Reloj (excepción con J).",
              "diligente (palabra con G) vs. cojines (excepción con J).",
              "Ingeniero (palabra con G) vs. injertar (excepción con J)."
            ],
            exercise: "Corrige si es necesario: 'El jeneral dio la orden.'",
            solution: "El general dio la orden.",
            explanation: "La distinción entre *G* y *J* es una de las más complejas. La *G* tiene dos sonidos (suave y fuerte), mientras que la *J* siempre tiene el sonido fuerte. Las reglas de las sílabas *ge/gi* (con *G* sonido fuerte) y *gue/gui* (con *U* muda) son esenciales para su correcto uso, junto con las excepciones."
          }
        ]
      }
    ]
  },
  {
    unit: "Unidad IV",
    title: "Homófonos y parónimos",
    description: "Aprende a diferenciar palabras que suenan igual o parecido, pero tienen significados y escrituras distintas, evitando errores comunes.",
    fixedImageUrl: 'homofonos-paronimos.jpg', // Image for this unit
    sections: [
      {
        sectionTitle: "4.1. Homófonos",
        rules: [
          {
            rule: "Homófonos son palabras de distinto significado pero igual sonido. Pueden tener distinta escritura. Se diferencian de homógrafos (igual escritura, distinto significado).",
            examples: [
              "Bello (Hermoso) / vello (Pelo corto y fino)",
              "Vasto (territorio amplio) / Basto (sin refinamiento)",
              "Botar (Echar, rebotar) / votar (Dar voto)",
              "Ay (interjección de dolor) / Hay (del verbo haber)",
              "echo (del verbo echar) / hecho (del verbo hacer o sustantivo)",
              "Has (del verbo haber) / Haz (del verbo hacer) / As (naipe o persona destacada)",
            ],
            exercise: "Completa la frase: ___ (interjección de dolor), me duele.",
            solution: "Ay",
            explanation: "Los *homófonos* son palabras que *suenan igual* pero tienen *significados diferentes*. A menudo se escriben de manera distinta, lo que puede causar errores ortográficos. Es fundamental conocer el contexto para elegir la palabra correcta. Ejemplos adicionales: *hola* (saludo) / *ola* (del mar), *casa* (vivienda) / *caza* (de cazar)."
          }
        ]
      },
      {
        sectionTitle: "4.2. Parónimos",
        rules: [
          {
            rule: "Parónimos son palabras que suenan parecido, pero poseen estructuras distintas y distinto significado. Pueden inducir al error ortográfico.",
            examples: [
              "desbastar (rebajar) / devastar (destruir)",
              "hizo (del verbo hacer) / izo (del verbo izar)",
              "infringió (incumplir) / infligió (causar daño)",
              "deshecha (estropeada) / desecha (del verbo desechar)",
              "consejo (recomendación) / concejo (corporación municipal)",
            ],
            exercise: "Completa la frase: Él ___ (del verbo hacer) la tarea.",
            solution: "hizo",
            explanation: "Los *parónimos* son palabras que *suenan de forma similar* pero tienen *significados y escrituras diferentes*. La similitud fonética puede llevar a confusiones. Es importante prestar atención a las pequeñas diferencias en su pronunciación y escritura. Ejemplos adicionales: *actitud* (disposición) / *aptitud* (capacidad), *sesión* (reunión) / *cesión* (traspaso)."
          }
        ]
      }
    ]
  },
  {
    unit: "Unidad V",
    title: "Acentuación",
    description: "Comprende las reglas de acentuación de palabras agudas, graves, esdrújulas y sobreesdrújulas, así como el uso del acento diacrítico y enfático.",
    fixedImageUrl: 'acentuacion.jpg', // Image for this unit
    sections: [
      {
        sectionTitle: "5.1. Reglas de acentuación",
        rules: [
          {
            rule: "El acento gráfico, ortográfico o tilde es un signo inclinado sobre la vocal tónica.",
            examples: ["canción", "árbol", "rápido"],
            exercise: "Marca la tilde en 'cafe'.",
            solution: "café",
            explanation: "El *acento gráfico* (o tilde) es un signo que se coloca sobre la vocal de la *sílaba tónica* (la que se pronuncia con mayor fuerza) siguiendo reglas específicas. Su función es indicar dónde recae el énfasis en la palabra y diferenciar significados. No todas las palabras con sílaba tónica llevan tilde."
          }
        ]
      },
      {
        sectionTitle: "5.1.1. Separación silábica.",
        rules: [
          {
            rule: "La separación silábica es fundamental para aplicar las reglas de acentuación.",
            examples: ["ca-sa", "a-mor", "pa-ra-gua"],
            exercise: "Separa en sílabas la palabra 'computadora'.",
            solution: "com-pu-ta-do-ra",
            explanation: "Para acentuar correctamente, primero debes saber dividir una palabra en *sílabas*. Esto te permite identificar la *sílaba tónica* (la que lleva el golpe de voz) y determinar si la palabra es aguda, grave, esdrújula o sobreesdrújula, lo cual es el primer paso para aplicar las reglas de tildación."
          }
        ]
      },
      {
        sectionTitle: "5.1.2. Palabras agudas:",
        rules: [
          {
            rule: "Se acentúan si terminan en N, S o Vocal.",
            examples: ["Después", "sepáis", "también", "lidió", "averiguó", "liáis", "actuéis", "huí", "fluí", "atribuí", "construí", "café", "balón"],
            exercise: "Acentúa si es necesario: 'cancion'.",
            solution: "canción",
            explanation: "Las *palabras agudas* son aquellas cuya *sílaba tónica* es la *última*. Llevan tilde solo si terminan en *N*, *S* o en cualquier *vocal* (a, e, i, o, u). Ejemplos: *sofá*, *corazón*, *compás*. Si terminan en otra consonante, no llevan tilde (ej. *pared*, *reloj*)."
          }
        ]
      },
      {
        sectionTitle: "5.1.3. Palabras graves:",
        rules: [
          {
            rule: "Se acentúan si terminan en consonantes que NO sean N, S, o Vocal.",
            examples: ["Huésped", "estiércol", "Túy", "fórceps", "bíceps", "trémens", "fénix", "árbol", "fácil"],
            exercise: "Acentúa si es necesario: 'arbol'.",
            solution: "árbol",
            explanation: "Las *palabras graves* (o llanas) son aquellas cuya *sílaba tónica* es la *penúltima*. Llevan tilde si *NO* terminan en *N*, *S* o *vocal*. Es la regla opuesta a las agudas. Ejemplos: *azúcar*, *difícil*, *álbum*. Si terminan en N, S o vocal, no llevan tilde (ej. *mesa*, *cantan*)."
          }
        ]
      },
      {
        sectionTitle: "5.1.4. Palabras esdrújulas y sobreesdrújulas:",
        rules: [
          {
            rule: "Siempre llevan acento gráfico.",
            examples: [
              "Esdrújulas: Viéselos", "piénsalo", "miércoles", "cuádruple", "lingüística", "Océano", "Línea", "Caótico", "Núcleo", "Teórico", "Héroe",
              "Sobreesdrújulas: dímelo", "repítemelo", "decídnoslo", "dijérasemelo"
            ],
            exercise: "Acentúa si es necesario: 'telefono'.",
            solution: "teléfono",
            explanation: "Las *palabras esdrújulas* (sílaba tónica en la *antepenúltima*) y *sobreesdrújulas* (sílaba tónica antes de la antepenúltima) *siempre* llevan tilde. Esta es la regla más sencilla. Ejemplos de esdrújulas: *pájaro*, *médico*. Ejemplos de sobreesdrújulas: *cómetelo*, *cuéntamelo*."
          }
        ]
      },
      {
        sectionTitle: "5.2. Acento diacrítico",
        rules: [
          {
            rule: "Permite distinguir palabras tónicas de otras formalmente iguales pero de pronunciación átona y distinto valor o significado.",
            examples: [
              "él (pronombre) / el (artículo)",
              "tú (pronombre) / tu (posesivo)",
              "mí (pronombre) / mi (posesivo o nota musical)",
              "sí (afirmación o pronombre) / si (conjunción o nota musical)",
              "té (infusión) / te (pronombre)",
            ],
            exercise: "Completa con 'el' o 'él': ___ libro es de ___.",
            solution: "El libro es de él.",
            explanation: "El *acento diacrítico* se usa para diferenciar palabras que se escriben igual pero tienen *significados y funciones gramaticales diferentes*. Una de ellas es tónica (lleva acento de intensidad) y la otra es átona (no lo lleva). Es una excepción a las reglas generales de acentuación. Ejemplos: *más* (cantidad) / *mas* (pero), *solo* (adjetivo) / *sólo* (adverbio, aunque su uso ha cambiado)."
          }
        ]
      },
      {
        sectionTitle: "5.3. Acento enfático",
        rules: [
          {
            rule: "Se usa en palabras como qué, cómo, cuándo, dónde, quién, si forman parte de una pregunta o exclamación (directa o indirecta).",
            examples: [
              "¿Qué quieres?",
              "¿Por qué callas?",
              "¡Cuánto tiempo!",
              "No sé qué quieres",
              "Dime por qué lo hiciste"
            ],
            exercise: "Acentúa si es necesario: 'Que hora es?'",
            solution: "¿Qué hora es?",
            explanation: "El *acento enfático* se coloca en las palabras interrogativas y exclamativas (*qué, quién, cómo, cuándo, dónde, cuánto, cuál*) para distinguirlas de sus homónimas relativas o conjunciones. Se usa tanto en preguntas/exclamaciones directas (con signos) como indirectas (sin signos). Ejemplos: *¿Quién viene?*, *No sé quién viene*."
          }
        ]
      }
    ]
  },
  {
    unit: "Unidad VI",
    title: "Signos de puntuación",
    description: "Domina el uso de la coma, el punto, punto y coma, dos puntos, puntos suspensivos, signos dobles, diéresis, barra y asterisco para una escritura clara.",
    fixedImageUrl: 'signos-puntuacion.jpg', // Image for this unit
    sections: [
      {
        sectionTitle: "6.1. Signos simples",
        rules: [
          {
            rule: "6.1.1. La coma: Se escriben entre dos comas ciertas expresiones.",
            examples: ["Esto es", "Es decir", "En fin", "Por último", "Por consiguiente", "Sin embargo", "No obstante", "Juan, el carpintero, llegó."],
            exercise: "Añade comas donde sea necesario: 'María mi hermana es muy alta.'",
            solution: "María, mi hermana, es muy alta.",
            explanation: "La *coma* (,) indica una pausa breve. Se usa para separar elementos de una enumeración, para aislar incisos (explicaciones o aclaraciones), antes o después de ciertas conjunciones y adverbios (como *sin embargo*, *es decir*), y para separar el vocativo del resto de la oración. Es crucial para la claridad del texto."
          },
          {
            rule: "6.1.2. El punto: Se usa para indicar el final de una oración o de una abreviatura.",
            examples: ["El perro ladra. La casa es grande.", "Sr. Pérez", "etc."],
            exercise: "Añade el punto donde sea necesario: 'Hoy es un buen día'",
            solution: "Hoy es un buen día.",
            explanation: "El *punto* (.) marca el final de una oración con sentido completo (punto y seguido), el final de un párrafo (punto y aparte) o el final de un texto (punto final). También se usa después de las abreviaturas. Es el signo de pausa más largo y definitivo."
          },
          {
            rule: "6.1.3. Punto y coma: Se usa para unir oraciones relacionadas sin una conjunción, o para separar elementos en una lista compleja.",
            examples: ["La situación es compleja; debemos actuar con cautela.", "Asistieron: Juan, el médico; Ana, la abogada; y Pedro, el ingeniero."],
            exercise: "Añade punto y coma donde sea necesario: 'Estudió mucho no obstante reprobó el examen.'",
            solution: "Estudió mucho; no obstante, reprobó el examen.",
            explanation: "El *punto y coma* (;) indica una pausa intermedia, más larga que la coma pero más corta que el punto. Se usa para separar oraciones sintácticamente independientes pero semánticamente relacionadas, o para separar elementos de una enumeración compleja que ya contienen comas internas."
          },
          {
            rule: "6.1.4. Dos puntos: Se usan para introducir una enumeración, una cita textual o una explicación.",
            examples: ["Necesito tres cosas: pan, leche y huevos.", "Dijo Juan: 'No iré'.", "Estaba cansado: no durmió bien."],
            exercise: "Añade dos puntos donde sea necesario: 'Mis colores favoritos son el rojo el azul y el verde.'",
            solution: "Mis colores favoritos son: el rojo, el azul y el verde.",
            explanation: "Los *dos puntos* (:) se usan para anunciar algo que sigue a lo que se acaba de decir. Pueden introducir una enumeración, una cita textual, una explicación o una conclusión. También se usan después del saludo en cartas o correos electrónicos."
          },
          {
            rule: "6.1.5. Puntos suspensivos: Se usan para indicar una pausa, una interrupción, o que una enumeración está incompleta.",
            examples: ["No sé qué decir...", "Compró manzanas, peras, uvas..."],
            exercise: "Añade puntos suspensivos donde sea necesario: 'Si supieras lo que pasó'",
            solution: "Si supieras lo que pasó...",
            explanation: "Los *puntos suspensivos* (...) son siempre tres y se usan para indicar una interrupción en el discurso, una duda, una omisión de parte de un texto o que una enumeración podría continuar. Crean un efecto de suspenso o de algo inacabado."
          }
        ]
      },
      {
        sectionTitle: "6.2. Signos dobles",
        rules: [
          {
            rule: "6.2.1. Signos de exclamación e interrogación: Se usan en oraciones interrogativas o exclamativas, al principio y al final.",
            examples: ["¿Qué quieres?", "¡Cuánto tiempo!", "¿Me lo darás cuando cobres?"],
            exercise: "Añade los signos de puntuación necesarios: 'Como estas'",
            solution: "¿Cómo estás?",
            explanation: "Los *signos de interrogación* (¿?) y *exclamación* (¡!) son dobles en español (uno de apertura y uno de cierre). Se usan para enmarcar preguntas y exclamaciones, respectivamente. Son fundamentales para la entonación y el significado de la oración."
          },
          {
            rule: "6.2.2. Comillas: Se usan para citar palabras textuales, para indicar que una palabra se usa en sentido irónico o especial, o para títulos de obras.",
            examples: ["Dijo: 'La verdad es relativa'.", "Es un 'genio' (irónico).", "Leí 'Cien años de soledad'."],
            exercise: "Añade comillas donde sea necesario: 'El Quijote es una obra maestra'.",
            solution: "'El Quijote' es una obra maestra.",
            explanation: "Las *comillas* (simples '', dobles \"\" o angulares «») se usan para reproducir citas textuales, para indicar que una palabra se usa con un sentido especial o irónico, para títulos de artículos, poemas o capítulos, y para destacar palabras extranjeras o poco comunes. Su uso varía según el contexto."
          }
        ]
      },
      {
        sectionTitle: "6.3. Otros signos",
        rules: [
          {
            rule: "6.3.1. Diéresis: Se usa sobre la U (Ü) entre G y E/I cuando la U debe pronunciarse.",
            examples: ["Vergüenza", "Pingüino", "Cigüeña", "Antigüedad", "Lingüística", "Desagüe", "Bilingüe", "Agüero", "Ambigüedad"],
            exercise: "Añade diéresis si es necesario: 'pinguino'.",
            solution: "pingüino",
            explanation: "La *diéresis* (¨) se coloca sobre la *U* en las sílabas *güe* y *güi* para indicar que la *U* debe pronunciarse. Sin la diéresis, la *U* sería muda (como en *guerra* o *guitarra*). Es un signo crucial para la correcta pronunciación y escritura."
          },
          {
            rule: "6.3.2. Barra: Se usa para indicar opciones, divisiones o en abreviaturas.",
            examples: ["y/o", "km/h", "c/ (calle)"],
            exercise: "Escribe 'kilómetros por hora' usando la barra.",
            solution: "km/h",
            explanation: "La *barra* (/) se utiliza para indicar opciones (*y/o*), divisiones en expresiones matemáticas o unidades de medida (*km/h*), y en algunas abreviaturas o para separar versos. Es un signo versátil que condensa información."
          },
          {
            rule: "6.3.3. Asterisco: Se usa para indicar una nota al pie, una omisión o una corrección.",
            examples: ["Ver nota*", "Se omitió el texto***", "La palabra correcta es *casa*."],
            exercise: "Usa un asterisco para indicar una nota al pie.",
            solution: "Texto importante* (*Nota: Ver página 5)",
            explanation: "El *asterisco* (*) se usa para señalar una nota al margen o al pie de página, para indicar la omisión de parte de un texto, o para marcar una palabra incorrecta o una corrección. También se usa en lingüística para marcar formas agramaticales."
          },
          {
            rule: "6.3.4. Llaves: Se usan para agrupar elementos en esquemas, clasificaciones o expresiones matemáticas.",
            examples: ["{a, b, c}", "{animales: [perro, gato], plantas: [rosa, pino]}"],
            exercise: "Agrupa los siguientes elementos usando llaves: manzana, pera, uva.",
            solution: "{manzana, pera, uva}",
            explanation: "Las *llaves* ({}) se utilizan para agrupar elementos en conjuntos, esquemas o clasificaciones, especialmente en contextos matemáticos o de programación. Indican que los elementos dentro de ellas forman un grupo relacionado."
          }
        ]
      }
    ]
  }
];

// Component for displaying a rule and its exercise
const RuleCard = ({ rule, examples, exercise, solution, explanation }) => {
  const [showSolution, setShowSolution] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [exerciseFeedback, setExerciseFeedback] = useState('');
  const [showExplanation, setShowExplanation] = useState(false); // State to control visibility

  // Simple Markdown renderer for bold text
  const renderMarkdown = (text) => {
    if (!text) return null;
    // Replace *text* with <strong>text</strong>
    return <div dangerouslySetInnerHTML={{ __html: text.replace(/\*(.*?)\*/g, '<strong>$1</strong>') }} />;
  };

  const handleCheckExercise = () => {
    if (userAnswer.toLowerCase().trim() === solution.toLowerCase().trim()) {
      setExerciseFeedback('¡Correcto!');
    } else {
      setExerciseFeedback(`Incorrecto. La respuesta correcta es: ${solution}`);
    }
    setShowSolution(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
      <p className="text-gray-800 mb-3 text-lg font-medium leading-relaxed">{rule}</p>
      {examples.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Ejemplos:</h4>
          <ul className="list-disc list-inside text-gray-600">
            {examples.map((ex, idx) => (
              <li key={idx} className="mb-1">{ex}</li>
            ))}
          </ul>
        </div>
      )}
      {exercise && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Ejercicio:</h4>
          <p className="text-blue-700 mb-3">{exercise}</p>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              setExerciseFeedback('');
              setShowSolution(false);
            }}
            className="w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Escribe tu respuesta aquí..."
          />
          <button
            onClick={handleCheckExercise}
            className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Comprobar
          </button>
          {showSolution && (
            <p className={`mt-3 font-semibold ${exerciseFeedback.includes('Correcto') ? 'text-green-600' : 'text-red-600'}`}>
              {exerciseFeedback}
            </p>
          )}
        </div>
      )}
      <div className="mt-4">
        <button
          onClick={() => setShowExplanation(!showExplanation)} // Toggle visibility
          className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
        >
          {showExplanation ? 'Ocultar Explicación' : 'Ver Explicación ✨'}
        </button>
        {showExplanation && (
          <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200 text-green-800">
            {renderMarkdown(explanation)}
          </div>
        )}
      </div>
    </div>
  );
};

// Component for the Word Checker
const WordChecker = () => {
  const [word, setWord] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const checkWord = async () => {
    if (!word.trim()) {
      setResult('Por favor, introduce una palabra.');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const prompt = `Verifica la ortografía de la palabra en español "${word}". Responde con un objeto JSON. Si la palabra es correcta, el objeto debe tener "status": "correct" y "message": "La palabra '${word}' está escrita correctamente.". Si la palabra es incorrecta, el objeto debe tener "status": "incorrect", "correctedWord": "la palabra correctamente escrita", y "explanation": "una explicación detallada y clara de por qué la palabra original es incorrecta y cómo se aplica la regla de ortografía para la corrección. Incluye la regla específica si es posible.". Asegúrate de que 'correctedWord' y 'explanation' siempre estén presentes y sean informativos si el 'status' es 'incorrect'.`;
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              status: { type: "STRING" },
              message: { type: "STRING", nullable: true },
              correctedWord: { type: "STRING", nullable: true },
              explanation: { type: "STRING", nullable: true }
            }
          }
        }
      };
      const apiKey = "AIzaSyC1nEiaOnL9rYGUuKlsqKkYMBH0Q-x3fpM";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resultData = await response.json();
      if (resultData.candidates && resultData.candidates.length > 0 &&
          resultData.candidates[0].content && resultData.candidates[0].content.parts &&
          resultData.candidates[0].content.parts.length > 0) {
        const jsonResponse = JSON.parse(resultData.candidates[0].content.parts[0].text);
        if (jsonResponse.status === "correct") {
          setResult(jsonResponse.message || `La palabra '${word}' está escrita correctamente.`);
        } else {
          const correctedWord = jsonResponse.correctedWord || 'La corrección no está disponible.';
          const explanation = jsonResponse.explanation || 'No se proporcionó una explicación detallada para esta corrección.';
          setResult(`La palabra '${word}' es incorrecta. La forma correcta es: '${correctedWord}'.\n\nExplicación: ${explanation}`);
        }
      } else {
        setResult('No se pudo verificar la palabra. Inténtalo de nuevo. La respuesta del modelo fue inesperada.');
      }
    } catch (error) {
      console.error("Error checking word:", error);
      setResult('Ocurrió un error al verificar la palabra. Por favor, inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Verificador de Palabras ✨</h3>
      <p className="text-gray-700 mb-4">Introduce una palabra para verificar su ortografía según las reglas del manual.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
          placeholder="Escribe una palabra..."
        />
        <button
          onClick={checkWord}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verificando...' : 'Verificar'}
        </button>
      </div>
      {result && (
        <div className="mt-5 p-4 bg-purple-50 rounded-md border border-purple-200 text-purple-800 font-medium whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
};

// Component for the Sentence Corrector
const SentenceCorrector = () => {
  const [sentence, setSentence] = useState('');
  const [correctedData, setCorrectedData] = useState({ correctedText: '', explanation: '' });
  const [loading, setLoading] = useState(false);

  const correctSentence = async () => {
    if (!sentence.trim()) {
      setCorrectedData({ correctedText: 'Por favor, introduce una frase para corregir.', explanation: '' });
      return;
    }

    setLoading(true);
    setCorrectedData({ correctedText: '', explanation: '' });

    try {
      const prompt = `Corrige la ortografía, gramática y puntuación de la siguiente frase en español. Si es posible, sugiere una ligera mejora en la redacción para mayor claridad o estilo, manteniendo el significado original. Responde con un objeto JSON que contenga "correctedText": "la frase corregida o mejorada", y "explanation": "una explicación detallada de los cambios realizados y las reglas de ortografía, gramática o puntuación aplicadas.". Asegúrate de que 'correctedText' y 'explanation' siempre estén presentes. Frase: "${sentence}"`;
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              correctedText: { type: "STRING" },
              explanation: { type: "STRING" }
            }
          }
        }
      };
      const apiKey = "AIzaSyC1nEiaOnL9rYGUuKlsqKkYMBH0Q-x3fpM";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resultData = await response.json();
      if (resultData.candidates && resultData.candidates.length > 0 &&
          resultData.candidates[0].content && resultData.candidates[0].content.parts &&
          resultData.candidates[0].content.parts.length > 0) {
        const jsonResponse = JSON.parse(resultData.candidates[0].content.parts[0].text);
        setCorrectedData(jsonResponse);
      } else {
        setCorrectedData({ correctedText: 'No se pudo corregir la frase. Inténtalo de nuevo.', explanation: '' });
      }
    } catch (error) {
      console.error("Error correcting sentence:", error);
      setCorrectedData({ correctedText: 'Ocurrió un error al corregir la frase. Por favor, inténtalo más tarde.', explanation: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Corrector de Frases ✨</h3>
      <p className="text-gray-700 mb-4">Introduce una frase para corregir su ortografía, gramática y puntuación.</p>
      <div className="flex flex-col gap-4">
        <textarea
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 min-h-[100px]"
          placeholder="Escribe tu frase aquí..."
        ></textarea>
        <button
          onClick={correctSentence}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Corrigiendo...' : 'Corregir Frase'}
        </button>
      </div>
      {correctedData.correctedText && (
        <div className="mt-5 p-4 bg-indigo-50 rounded-md border border-indigo-200 text-indigo-800 font-medium">
          <h4 className="font-semibold mb-2">Frase corregida:</h4>
          <p className="mb-3">{correctedData.correctedText}</p>
          {correctedData.explanation && (
            <>
              <h4 className="font-semibold mb-2">Explicación:</h4>
              <p className="whitespace-pre-wrap">{correctedData.explanation}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// New Component: Long Text Corrector
const LongTextCorrector = () => {
  const [text, setText] = useState('');
  const [correctedTextResult, setCorrectedTextResult] = useState('');
  const [correctionExplanation, setCorrectionExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCorrectText = async () => {
    if (!text.trim()) {
      setCorrectedTextResult('Por favor, introduce un texto para corregir.');
      setCorrectionExplanation('');
      return;
    }

    setLoading(true);
    setCorrectedTextResult('');
    setCorrectionExplanation('');

    try {
      const prompt = `Corrige la ortografía, gramática y puntuación del siguiente texto en español. Además, sugiere mejoras en la redacción para mayor claridad y estilo, manteniendo el significado original. Responde con un objeto JSON que contenga dos campos: "correctedText" con el texto corregido y mejorado, y "explanation" con una explicación detallada de todos los cambios realizados y las reglas aplicadas (ortografía, gramática, puntuación, estilo). Texto: "${text}"`;
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              correctedText: { type: "STRING" },
              explanation: { type: "STRING" }
            }
          }
        }
      };
      const apiKey = "AIzaSyC1nEiaOnL9rYGUuKlsqKkYMBH0Q-x3fpM";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resultData = await response.json();
      if (resultData.candidates && resultData.candidates.length > 0 &&
          resultData.candidates[0].content && resultData.candidates[0].content.parts &&
          resultData.candidates[0].content.parts.length > 0) {
        const jsonResponse = JSON.parse(resultData.candidates[0].content.parts[0].text);
        setCorrectedTextResult(jsonResponse.correctedText || 'No se pudo obtener el texto corregido.');
        setCorrectionExplanation(jsonResponse.explanation || 'No se proporcionó una explicación detallada.');
      } else {
        setCorrectedTextResult('No se pudo procesar el texto. Inténtalo de nuevo.');
        setCorrectionExplanation('');
      }
    } catch (error) {
      console.error("Error correcting long text:", error);
      setCorrectedTextResult('Ocurrió un error al corregir el texto. Por favor, inténtalo más tarde.');
      setCorrectionExplanation('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Corrector de Texto Largo ✨</h3>
      <p className="text-gray-700 mb-4">Pega un texto extenso aquí para corregir su ortografía, gramática, puntuación y mejorar su redacción.</p>
      <div className="flex flex-col gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 min-h-[150px]"
          placeholder="Pega tu texto aquí..."
        ></textarea>
        <button
          onClick={handleCorrectText}
          disabled={loading}
          className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Corrigiendo Texto...' : 'Corregir Texto'}
        </button>
      </div>
      {correctedTextResult && (
        <div className="mt-5 p-4 bg-teal-50 rounded-md border border-teal-200 text-teal-800 font-medium">
          <h4 className="font-semibold mb-2">Texto corregido:</h4>
          <p className="mb-3 whitespace-pre-wrap">{correctedTextResult}</p>
          {correctionExplanation && (
            <>
              <h4 className="font-semibold mb-2">Explicación de la Corrección:</h4>
              <p className="whitespace-pre-wrap">{correctionExplanation}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};


// APA References Component
const ApaReferences = () => {
  const references = [
    "Real Academia Española. (2010). Ortografía de la lengua española. Espasa.",
    "Seco, M. (2011). Gramática esencial de la lengua española. Espasa.",
    "Martínez de Sousa, J. (2014). Manual de estilo de la lengua española. Trea.",
    "Gómez Torrego, L. (2016). Gramática didáctica del español. SM.",
    "Cacho Reyes, J. A. (2025). Manual de ortografía del español. Facultad de Idiomas, Universidad Autónoma de Baja California."
  ];

  return (
    <section id="references" className="mb-16">
      <div className="bg-white p-6 rounded-lg shadow-md mt-12 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Referencias</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-3">
          {references.map((ref, index) => (
            <li key={index}>{ref}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};


// Main App Component
const App = () => {
  const [activeUnit, setActiveUnit] = useState("cover"); // Start with 'cover' as the active section
  const [isAuthReady, setIsAuthReady] = useState(false);
  const authRef = useRef(null);
  const dbRef = useRef(null);

  useEffect(() => {
    // Initialize Firebase
    try {
      // Use empty object if __firebase_config is not defined (for local runs)
      const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
      const app = initializeApp(firebaseConfig);
      dbRef.current = getFirestore(app);
      authRef.current = getAuth(app);

      const unsubscribe = onAuthStateChanged(authRef.current, async (user) => {
        if (!user) {
          try {
            // Use empty string if __initial_auth_token is not defined (for local runs)
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
              await signInWithCustomToken(authRef.current, __initial_auth_token);
            } else {
              await signInAnonymously(authRef.current);
            }
          } catch (error) {
            console.error("Firebase Auth Error:", error);
          }
        }
        setIsAuthReady(true);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
      setIsAuthReady(true); // Proceed without Firebase if init fails
    }
  }, []);

  // Function to scroll to a unit
  const scrollToUnit = (unitId) => {
    const element = document.getElementById(unitId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 font-inter text-gray-900">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
        `}
      </style>

      {/* Header */}
      <header className="bg-white shadow-lg py-4 px-6 fixed top-0 left-0 w-full z-10">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-2 sm:mb-0">
            Manual de Ortografía
          </h1>
          <nav className="flex flex-wrap justify-center sm:justify-end gap-3">
            <button
              onClick={() => {
                setActiveUnit("cover");
                scrollToUnit("cover");
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out
                ${activeUnit === "cover"
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-800'
                }`}
              title="Página de presentación del manual."
            >
              Portada
            </button>
            {orthographyContent.map((unitData) => (
              <button
                key={unitData.unit}
                onClick={() => {
                  setActiveUnit(unitData.unit);
                  scrollToUnit(unitData.unit);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out
                  ${activeUnit === unitData.unit
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-800'
                  }`}
                title={unitData.description} // Add this for tooltip
            >
                {unitData.title} {/* Display full title here */}
              </button>
            ))}
             <button
              onClick={() => {
                setActiveUnit("references"); // Set a dummy active unit for references
                scrollToUnit("references");
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out
                ${activeUnit === "references"
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-800'
                }`}
              title="Lista de fuentes y bibliografía utilizada para el manual."
            >
              Referencias
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pt-24"> {/* Added pt-24 to account for fixed header */}
        {/* Integrated Cover Section */}
        <section id="cover" className="mb-16 flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-5xl font-extrabold text-indigo-800 mb-8 leading-tight">
            Ortografía del Español
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-4xl mb-8 gap-8">
            {/* Logo UABC */}
            <img src="logo uabc.jpg" alt="Logo UABC" className="w-32 h-auto object-contain rounded-lg shadow-md" onError={(e) => { e.target.onerror = null; e.target.src = generateImageUrl(128, 128, 'D1D5DB', '4B5563', 'UABC'); }} />
            <div className="flex-grow text-lg text-gray-700 space-y-2">
              <p>Docente: <span className="font-semibold">Mtra. Maria Angela Rodriguez Montes</span></p>
              <p>Nombre de la tarea/actividad:</p>
              <p className="font-bold text-2xl text-indigo-700">Manual de ortografía</p>
              <p>Que presenta el alumno: <span className="font-semibold">Jesus Antonio Cacho Reyes (1196823)</span></p>
              <p>Grupo: <span className="font-semibold">202</span></p>
              <p>Correo electrónico: <span className="font-semibold">jesus.cacho@uabc.edu.mx</span></p>
            </div>
            {/* Logo FI */}
            <img src="logo fi.png" alt="Logo Facultad de Idiomas" className="w-32 h-auto object-contain rounded-lg shadow-md" onError={(e) => { e.target.onerror = null; e.target.src = generateImageUrl(128, 128, 'D1D5DB', '4B5563', 'FI'); }} />
          </div>
          <p className="text-xl text-gray-600 mt-4">Mexicali, B.C., mayo del 2025.</p>
        </section>


        {orthographyContent.map((unitData) => (
          <section key={unitData.unit} id={unitData.unit} className="mb-16">
            <h2 className="text-4xl font-bold text-center text-indigo-800 mb-10 mt-6 leading-tight">
              {unitData.title}
            </h2>

            {/* Unit Image - Now fixed */}
            <div className="flex justify-center mb-12">
              <img
                src={unitData.fixedImageUrl}
                alt={`Imagen para ${unitData.title}`}
                className="w-full max-w-2xl h-auto rounded-lg shadow-xl border border-gray-200 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  // Fallback to a placeholder if the image is not found
                  e.target.src = generateImageUrl(600, 300, 'CCCCCC', '000000', `Imagen de ${unitData.unit}`);
                }}
              />
            </div>

            {/* Render Word Checker and Sentence Corrector and Long Text Corrector only once, at the top of the manual content */}
            {unitData.unit === orthographyContent[0].unit && (
              <>
                <WordChecker />
                <SentenceCorrector />
                <LongTextCorrector /> {/* New component added here */}
              </>
            )}

            {/* Rules Sections */}
            {unitData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-10">
                <h3 className="text-3xl font-semibold text-indigo-700 mb-6 border-b-2 border-indigo-300 pb-2">
                  {section.sectionTitle}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {section.rules.map((rule, ruleIndex) => (
                    <RuleCard
                      key={ruleIndex}
                      rule={rule.rule}
                      examples={rule.examples}
                      exercise={rule.exercise}
                      solution={rule.solution}
                      explanation={rule.explanation} // Pass the fixed explanation
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
        <ApaReferences />
      </main>

      {/* Footer */}
      <footer className="bg-indigo-800 text-white py-6 px-4 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-lg mb-2">
            Proyecto Final de Ortografía del Español - Facultad de Idiomas
          </p>
          <p className="text-sm">
            Diseñado para el uso y beneficio de maestros y alumnos.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
