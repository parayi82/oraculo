#!/usr/bin/env node
// Generates HyperFrames HTML compositions for all 24 JoyMannersKids videos

const fs = require('fs');
const path = require('path');

const SCHEDULE = [
  { id:1,  emoji:'🐄', thumbGradient:'linear-gradient(135deg,#87CEEB,#5BB3E0 45%,#7EC850)',
    title:'Los Sonidos de los Animales de la Granja', date:'2026-09-01', dayLabel:'Martes, 1 Sep',
    category:'e', categoryLabel:'Educativo',
    description:'Los pequeños aprenden los sonidos de la vaca, el cerdo, el gallo y el caballo.',
    tags:['animales','sonidos','granja','educativo'], duration:'8:45',
    scenes:[
      { emoji:'🐄', color:'#87CEEB', bg:'linear-gradient(135deg,#87CEEB,#5BB3E0 45%,#7EC850)',
        title:'La Vaca', subtitle:'¡Muuuuu!', text:'La vaca hace... ¡MUUUUU!', secs:50 },
      { emoji:'🐷', color:'#FFB3C6', bg:'linear-gradient(135deg,#FFB3C6,#FF85A1 45%,#C8A075)',
        title:'El Cerdo', subtitle:'¡Oinc Oinc!', text:'El cerdo hace... ¡OINC!', secs:50 },
      { emoji:'🐓', color:'#FFD340', bg:'linear-gradient(135deg,#FF9033,#FFD340 55%,#FFF0A0)',
        title:'El Gallo', subtitle:'¡Kikiriki!', text:'El gallo hace... ¡KIKIRIKI!', secs:50 },
      { emoji:'🐴', color:'#7EC850', bg:'linear-gradient(135deg,#87CEEB,#5BB3E0 40%,#7EC850)',
        title:'El Caballo', subtitle:'¡Hiiii!', text:'El caballo hace... ¡HIIII!', secs:50 },
      { emoji:'🐄🐷🐓🐴', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FF9033 50%,#FF6B52)',
        title:'¡Repasemos!', subtitle:'¿Cuál es tu favorito?', text:'¡Todos juntos!', secs:45 },
    ]
  },
  { id:2,  emoji:'🐮', thumbGradient:'linear-gradient(135deg,#9B7FE8,#C860A0 45%,#FF9066)',
    title:'La Vaca y la Gran Piñata de la Granja', date:'2026-09-04', dayLabel:'Viernes, 4 Sep',
    category:'h', categoryLabel:'Historia',
    description:'La vaca Lola organiza una piñata enorme con todos los animales de la granja.',
    tags:['vaca','piñata','amigos','fiesta'], duration:'9:20',
    scenes:[
      { emoji:'🐄', color:'#9B7FE8', bg:'linear-gradient(135deg,#9B7FE8,#C860A0)',
        title:'Lola la Vaca', subtitle:'¡Hola amigos!', text:'Lola quiere hacer una fiesta.', secs:55 },
      { emoji:'🎊', color:'#C860A0', bg:'linear-gradient(135deg,#C860A0,#FF9066)',
        title:'La Gran Piñata', subtitle:'¡Es enorme!', text:'Una piñata llena de sorpresas.', secs:55 },
      { emoji:'🐷🐓🐴', color:'#FF9066', bg:'linear-gradient(135deg,#FF9066,#FFD340)',
        title:'Los Amigos', subtitle:'¡Todos vienen!', text:'El cerdo, el gallo y el caballo llegan.', secs:55 },
      { emoji:'🎉', color:'#9B7FE8', bg:'linear-gradient(135deg,#9B7FE8,#4EC9E8)',
        title:'¡La Rompieron!', subtitle:'¡Juntos pudimos!', text:'Entre todos rompieron la piñata.', secs:55 },
      { emoji:'🌟', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FF9033)',
        title:'Amigos para Siempre', subtitle:'El trabajo en equipo', text:'¡Juntos todo es posible!', secs:40 },
    ]
  },
  { id:3,  emoji:'🦫', thumbGradient:'linear-gradient(135deg,#2A9FC8,#1878A8 40%,#0E5A88)',
    title:'El Capitán Capibara: ¡A Navegar! 🌊', date:'2026-09-08', dayLabel:'Martes, 8 Sep',
    category:'a', categoryLabel:'Aventura',
    description:'El valiente Capitán Capibara zarpa al mar con su pequeño barco de madera.',
    tags:['capibara','mar','aventura','capitán'], duration:'10:05',
    scenes:[
      { emoji:'🦫', color:'#2A9FC8', bg:'linear-gradient(135deg,#87CEEB,#2A9FC8)',
        title:'El Capitán Capibara', subtitle:'¡Zarpa el barco!', text:'El capitán está listo para navegar.', secs:60 },
      { emoji:'⛵', color:'#1878A8', bg:'linear-gradient(135deg,#2A9FC8,#1878A8)',
        title:'El Barco de Madera', subtitle:'¡Al mar!', text:'El pequeño barco navega veloz.', secs:60 },
      { emoji:'🌊', color:'#0E5A88', bg:'linear-gradient(135deg,#1878A8,#0E5A88)',
        title:'Las Olas Gigantes', subtitle:'¡Cuidado!', text:'Las olas son grandes pero el capitán es valiente.', secs:60 },
      { emoji:'💨', color:'#2A9FC8', bg:'linear-gradient(135deg,#0E5A88,#2A9FC8)',
        title:'El Viento Fuerte', subtitle:'¡Aguanta!', text:'El viento sopla fuerte... ¡pero él no para!', secs:60 },
      { emoji:'🏖️', color:'#FFD340', bg:'linear-gradient(135deg,#2A9FC8,#87CEEB 50%,#7EC850)',
        title:'¡Llegamos!', subtitle:'¡La isla!', text:'El Capitán Capibara llega a la isla misteriosa.', secs:55 },
      { emoji:'🦫⭐', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FF9033)',
        title:'¡Un Héroe!', subtitle:'¡Bravo Capitán!', text:'La valentía siempre vence.', secs:40 },
    ]
  },
  { id:4,  emoji:'🦆', thumbGradient:'linear-gradient(135deg,#2ABABA,#3880C0 45%,#2060A0)',
    title:'El Detective Ornitorrinco y el Huevo Perdido', date:'2026-09-11', dayLabel:'Viernes, 11 Sep',
    category:'h', categoryLabel:'Historia',
    description:'El detective Ornitorrinco recibe una misión urgente: ¡alguien escondió los huevos de la gallina!',
    tags:['ornitorrinco','detective','misterio','huevos'], duration:'9:55',
    scenes:[
      { emoji:'🦆', color:'#2ABABA', bg:'linear-gradient(135deg,#2ABABA,#3880C0)',
        title:'Detective Ornitorrinco', subtitle:'¡El mejor detective!', text:'Nadie resuelve misterios mejor que él.', secs:58 },
      { emoji:'🥚', color:'#3880C0', bg:'linear-gradient(135deg,#3880C0,#2060A0)',
        title:'¡El Huevo Perdido!', subtitle:'¿Dónde está?', text:'La gallina no encuentra su huevo favorito.', secs:58 },
      { emoji:'🔍', color:'#2060A0', bg:'linear-gradient(135deg,#2060A0,#2ABABA)',
        title:'La Investigación', subtitle:'Siguiendo las pistas...', text:'El detective busca huellas por toda la granja.', secs:58 },
      { emoji:'🌾', color:'#7EC850', bg:'linear-gradient(135deg,#7EC850,#5BB3E0)',
        title:'Las Pistas', subtitle:'¡Aquí hay algo!', text:'Una pluma, una huella... ¡El misterio se aclara!', secs:58 },
      { emoji:'🤩', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FF9033)',
        title:'¡Caso Resuelto!', subtitle:'¡Lo encontró!', text:'El huevo estaba en el nido secreto.', secs:55 },
      { emoji:'🦆🥚', color:'#2ABABA', bg:'linear-gradient(135deg,#2ABABA,#87CEEB)',
        title:'El Detective Gana', subtitle:'¡Misión cumplida!', text:'¡El mejor detective de la granja!', secs:40 },
    ]
  },
  { id:5,  emoji:'🌈', thumbGradient:'linear-gradient(135deg,#FF6B8A,#FFD340 45%,#4EC9E8)',
    title:'Aprende los Colores con los Animales de la Granja', date:'2026-09-15', dayLabel:'Martes, 15 Sep',
    category:'e', categoryLabel:'Educativo',
    description:'El cerdo rosa, la vaca blanca, el caballo marrón y el pato amarillo enseñan todos los colores.',
    tags:['colores','animales','educativo','aprende'], duration:'7:30',
    scenes:[
      { emoji:'🐷', color:'#FF6B8A', bg:'linear-gradient(135deg,#FF6B8A,#FF9999)',
        title:'El Color Rosado', subtitle:'¡Como el cerdo!', text:'ROSADO — como la nariz del cerdito.', secs:40 },
      { emoji:'🐄', color:'#FFFFFF', bg:'linear-gradient(135deg,#D0D0D0,#FFFFFF)',
        title:'El Color Blanco', subtitle:'¡Como la vaca!', text:'BLANCO — como la leche fresquita.', secs:40 },
      { emoji:'🐴', color:'#A07850', bg:'linear-gradient(135deg,#C8A075,#A07850)',
        title:'El Color Marrón', subtitle:'¡Como el caballo!', text:'MARRÓN — como la tierra del campo.', secs:40 },
      { emoji:'🦆', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FFF0A0)',
        title:'El Color Amarillo', subtitle:'¡Como el pato!', text:'AMARILLO — como el sol brillante.', secs:40 },
      { emoji:'🌈', color:'#4EC9E8', bg:'linear-gradient(135deg,#FF6B8A,#FFD340 45%,#4EC9E8)',
        title:'¡El Arcoíris!', subtitle:'¡Todos los colores!', text:'Rojo, azul, amarillo, verde... ¡Juntos!', secs:45 },
    ]
  },
  { id:6,  emoji:'🐓', thumbGradient:'linear-gradient(135deg,#FF9033,#FFD340 55%,#FFF0A0)',
    title:'El Gallo Lorenzo Canta ¡Buenos Días! | Canción', date:'2026-09-18', dayLabel:'Viernes, 18 Sep',
    category:'c', categoryLabel:'Canción',
    description:'El gallo Lorenzo despierta a todos los animales con su canto cada mañana.',
    tags:['gallo','canción','mañana','despertar'], duration:'6:15',
    scenes:[
      { emoji:'🌅', color:'#FF9033', bg:'linear-gradient(135deg,#FF6B52,#FF9033)',
        title:'¡Buenos Días!', subtitle:'El sol sale...', text:'La mañana llega a la granja.', secs:35 },
      { emoji:'🐓', color:'#FFD340', bg:'linear-gradient(135deg,#FF9033,#FFD340)',
        title:'Lorenzo el Gallo', subtitle:'¡KIKIRIKI!', text:'Lorenzo canta para despertar a todos.', secs:35 },
      { emoji:'🎵', color:'#FFF0A0', bg:'linear-gradient(135deg,#FFD340,#FFF0A0)',
        title:'La Canción', subtitle:'¡Canta conmigo!', text:'Bue-nos dí-as, bue-nos dí-as, di-ce Lo-ren-zo.', secs:35 },
      { emoji:'🐄🐷🐑', color:'#87CEEB', bg:'linear-gradient(135deg,#FFF0A0,#87CEEB)',
        title:'Todos se Despiertan', subtitle:'¡La granja vive!', text:'Cada animal se despierta con la canción.', secs:35 },
      { emoji:'☀️', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FF9033)',
        title:'¡Un Nuevo Día!', subtitle:'¡Cantemos todos!', text:'Bue-nos dí-as, bue-nos dí-as, bue-nos dí-as a ti.', secs:30 },
    ]
  },
  { id:7,  emoji:'🔢', thumbGradient:'linear-gradient(135deg,#9B7FE8,#5BBDE8 50%,#4EC9E8)',
    title:'Los Números del 1 al 10 en la Granja', date:'2026-09-22', dayLabel:'Martes, 22 Sep',
    category:'e', categoryLabel:'Educativo',
    description:'Cuenta los pollitos, las vacas, los cerditos y más animales para aprender los números del 1 al 10.',
    tags:['números','contar','animales','educativo'], duration:'8:00',
    scenes:[
      { emoji:'1️⃣🐤', color:'#9B7FE8', bg:'linear-gradient(135deg,#9B7FE8,#7BB0F0)',
        title:'El Número 1', subtitle:'Un pollito', text:'UNO — 1 pollito en el nido.', secs:44 },
      { emoji:'2️⃣🐑', color:'#5BBDE8', bg:'linear-gradient(135deg,#7BB0F0,#5BBDE8)',
        title:'El Número 2', subtitle:'Dos ovejitas', text:'DOS — 2 ovejas en el campo.', secs:44 },
      { emoji:'3️⃣🐄', color:'#4EC9E8', bg:'linear-gradient(135deg,#5BBDE8,#4EC9E8)',
        title:'El Número 3', subtitle:'Tres vacas', text:'TRES — 3 vacas en el prado.', secs:44 },
      { emoji:'4️⃣🐷', color:'#9B7FE8', bg:'linear-gradient(135deg,#4EC9E8,#9B7FE8)',
        title:'El Número 4', subtitle:'Cuatro cerditos', text:'CUATRO — 4 cerditos jugando.', secs:44 },
      { emoji:'5️⃣🐓', color:'#5BBDE8', bg:'linear-gradient(135deg,#9B7FE8,#5BBDE8)',
        title:'El Número 5', subtitle:'Cinco gallos', text:'CINCO — 5 gallos cantando.', secs:44 },
      { emoji:'🔢', color:'#4EC9E8', bg:'linear-gradient(135deg,#5BBDE8,#4EC9E8)',
        title:'¡1, 2, 3, 4, 5!', subtitle:'¡Contamos juntos!', text:'Uno... dos... tres... cuatro... cinco... ¡Bravo!', secs:40 },
    ]
  },
  { id:8,  emoji:'🐷', thumbGradient:'linear-gradient(135deg,#C8A075,#A07850 40%,#7EC850)',
    title:'El Cerdito Pepón y el Charco de Lodo', date:'2026-09-25', dayLabel:'Viernes, 25 Sep',
    category:'h', categoryLabel:'Historia',
    description:'El cerdito Pepón adora bañarse en el lodo pero sus amigos no entienden por qué.',
    tags:['cerdo','lodo','amigos','historia'], duration:'9:10',
    scenes:[
      { emoji:'🐷', color:'#C8A075', bg:'linear-gradient(135deg,#C8A075,#A07850)',
        title:'Pepón el Cerdito', subtitle:'¡Le encanta el lodo!', text:'Pepón es un cerdito muy especial.', secs:55 },
      { emoji:'💧', color:'#A07850', bg:'linear-gradient(135deg,#A07850,#7EC850)',
        title:'El Gran Charco', subtitle:'¡Qué rico!', text:'Pepón encuentra el charco perfecto.', secs:55 },
      { emoji:'🐄🐓', color:'#7EC850', bg:'linear-gradient(135deg,#7EC850,#5BB3E0)',
        title:'Los Amigos no Entienden', subtitle:'¿Por qué el lodo?', text:'La vaca y el gallo no comprenden.', secs:55 },
      { emoji:'🌞', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FF9033)',
        title:'Pepón Explica', subtitle:'¡El lodo me enfría!', text:'El lodo me protege del calor del sol.', secs:55 },
      { emoji:'🐷🐄🐓', color:'#C8A075', bg:'linear-gradient(135deg,#C8A075,#A07850)',
        title:'¡Todos lo Entienden!', subtitle:'Somos diferentes', text:'Ser diferente está bien. ¡Nos queremos igual!', secs:45 },
    ]
  },
  { id:9,  emoji:'🦃', thumbGradient:'linear-gradient(135deg,#A0602A,#C88040 45%,#E8A060)',
    title:'El Pavo Don Tomás Aprende a Bailar', date:'2026-09-29', dayLabel:'Martes, 29 Sep',
    category:'c', categoryLabel:'Canción',
    description:'Don Tomás el pavo quiere bailar como sus amigos pero sus patas no lo obedecen.',
    tags:['pavo','bailar','canción','diversión'], duration:'7:50',
    scenes:[
      { emoji:'🦃', color:'#A0602A', bg:'linear-gradient(135deg,#A0602A,#C88040)',
        title:'Don Tomás el Pavo', subtitle:'¡Quiero bailar!', text:'Don Tomás sueña con ser bailarín.', secs:44 },
      { emoji:'💃', color:'#C88040', bg:'linear-gradient(135deg,#C88040,#E8A060)',
        title:'El Primer Intento', subtitle:'¡Ups!', text:'Sus patas se tropiezan... ¡pero se ríe!', secs:44 },
      { emoji:'🎵', color:'#E8A060', bg:'linear-gradient(135deg,#E8A060,#FFD340)',
        title:'La Canción del Baile', subtitle:'¡Mueve las patas!', text:'I-za-quierda, de-re-cha, gi-ra-gi-ra...', secs:44 },
      { emoji:'🦃🐷🐄', color:'#A0602A', bg:'linear-gradient(135deg,#C88040,#A0602A)',
        title:'Los Amigos Ayudan', subtitle:'¡Practiquemos juntos!', text:'Con práctica y alegría todo se puede.', secs:44 },
      { emoji:'🌟', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#E8A060)',
        title:'¡Don Tomás Baila!', subtitle:'¡Lo logró!', text:'¡Con esfuerzo y alegría lo logró!', secs:40 },
    ]
  },
  { id:10, emoji:'🐤', thumbGradient:'linear-gradient(135deg,#4EC9E8,#87CEEB 50%,#B0E8FF)',
    title:'El Patito Aprende a Nadar en el Estanque', date:'2026-10-02', dayLabel:'Viernes, 2 Oct',
    category:'h', categoryLabel:'Historia',
    description:'El patito pequeño tiene miedo del agua pero su mamá le enseña paso a paso.',
    tags:['pato','nadar','estanque','valentía'], duration:'8:35',
    scenes:[
      { emoji:'🐤', color:'#4EC9E8', bg:'linear-gradient(135deg,#4EC9E8,#87CEEB)',
        title:'El Patito Pipo', subtitle:'Tengo miedo...', text:'Pipo mira el estanque con miedo.', secs:50 },
      { emoji:'🦆', color:'#87CEEB', bg:'linear-gradient(135deg,#87CEEB,#B0E8FF)',
        title:'Mamá Pato', subtitle:'¡Yo te enseño!', text:'La mamá es la mejor maestra.', secs:50 },
      { emoji:'💧', color:'#4EC9E8', bg:'linear-gradient(135deg,#B0E8FF,#4EC9E8)',
        title:'El Primer Paso', subtitle:'¡Un pie!', text:'Primero un pie... luego el otro.', secs:50 },
      { emoji:'🏊', color:'#87CEEB', bg:'linear-gradient(135deg,#4EC9E8,#87CEEB)',
        title:'¡Está Nadando!', subtitle:'¡Lo logré!', text:'Pipo nada por primera vez. ¡Qué valiente!', secs:50 },
      { emoji:'🌟', color:'#FFD340', bg:'linear-gradient(135deg,#87CEEB,#FFD340)',
        title:'La Valentía', subtitle:'¡Puedes tú también!', text:'Cuando tengas miedo, recuerda a Pipo.', secs:35 },
    ]
  },
  { id:11, emoji:'🐑', thumbGradient:'linear-gradient(135deg,#E8B4D0,#C8B8F0 50%,#B0D8F8)',
    title:'La Oveja Esponjosa y su Lana Mágica', date:'2026-10-06', dayLabel:'Martes, 6 Oct',
    category:'h', categoryLabel:'Historia',
    description:'La ovejita Esponjosa descubre que su lana puede ser de todos los colores del arcoíris.',
    tags:['oveja','lana','colores','historia'], duration:'8:50',
    scenes:[
      { emoji:'🐑', color:'#E8B4D0', bg:'linear-gradient(135deg,#E8B4D0,#C8B8F0)',
        title:'Esponjosa la Oveja', subtitle:'¡Mi lana es especial!', text:'Esponjosa tiene la lana más suave del mundo.', secs:52 },
      { emoji:'✨', color:'#C8B8F0', bg:'linear-gradient(135deg,#C8B8F0,#B0D8F8)',
        title:'La Magia', subtitle:'¡Cambia de color!', text:'Un día su lana empieza a brillar de colores.', secs:52 },
      { emoji:'🌈', color:'#B0D8F8', bg:'linear-gradient(135deg,#B0D8F8,#E8B4D0)',
        title:'Los Colores', subtitle:'Rojo, azul, verde...', text:'Su lana muestra todos los colores del arcoíris.', secs:52 },
      { emoji:'🐑🌟', color:'#E8B4D0', bg:'linear-gradient(135deg,#E8B4D0,#FFD340)',
        title:'Ser Único', subtitle:'¡Eso es especial!', text:'Ser diferente es un regalo maravilloso.', secs:52 },
      { emoji:'❤️', color:'#C8B8F0', bg:'linear-gradient(135deg,#C8B8F0,#E8B4D0)',
        title:'Sé Tú Mismo', subtitle:'¡Eres único!', text:'Nunca cambies lo que te hace especial.', secs:35 },
    ]
  },
  { id:12, emoji:'🌙', thumbGradient:'linear-gradient(135deg,#4060C8,#6060A8 45%,#8060A8)',
    title:'El Caballo Valiente | Cuento para Dormir 🌟', date:'2026-10-09', dayLabel:'Viernes, 9 Oct',
    category:'h', categoryLabel:'Historia',
    description:'El caballo Bruno ayuda a todos los animales de noche. Un cuento suave y tierno.',
    tags:['caballo','dormir','cuento','noche'], duration:'7:45',
    scenes:[
      { emoji:'🌙', color:'#4060C8', bg:'linear-gradient(135deg,#1A2060,#4060C8)',
        title:'La Noche en la Granja', subtitle:'Todo está tranquilo...', text:'Las estrellas brillan sobre la granja dormida.', secs:44 },
      { emoji:'🐴', color:'#6060A8', bg:'linear-gradient(135deg,#4060C8,#6060A8)',
        title:'Bruno el Caballo', subtitle:'¡Yo cuido a todos!', text:'Bruno vigila la granja toda la noche.', secs:44 },
      { emoji:'⭐', color:'#8060A8', bg:'linear-gradient(135deg,#6060A8,#8060A8)',
        title:'Las Estrellas', subtitle:'Las estrellas cantan...', text:'Las estrellas le hacen compañía a Bruno.', secs:44 },
      { emoji:'🌟', color:'#4060C8', bg:'linear-gradient(135deg,#8060A8,#4060C8)',
        title:'Todos Seguros', subtitle:'Descansa, amigos...', text:'Bruno cuida para que todos duerman tranquilos.', secs:44 },
      { emoji:'💤', color:'#6060A8', bg:'linear-gradient(135deg,#4060C8,#1A2060)',
        title:'Buenas Noches', subtitle:'Duerme con una sonrisa', text:'Cierra los ojos... dulces sueños.', secs:35 },
    ]
  },
  { id:13, emoji:'🎵', thumbGradient:'linear-gradient(135deg,#FFD340,#FF9033 45%,#FF6B52)',
    title:'Canta con los Animales: ¡Uno, Dos, Tres!', date:'2026-10-13', dayLabel:'Martes, 13 Oct',
    category:'c', categoryLabel:'Canción',
    description:'Los animales de la granja se unen para cantar y contar juntos del 1 al 20.',
    tags:['canción','números','animales','música'], duration:'6:30',
    scenes:[
      { emoji:'🎵', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FF9033)',
        title:'¡La Canción de Contar!', subtitle:'¡Canta conmigo!', text:'Vamos a contar con los animales.', secs:35 },
      { emoji:'1️⃣2️⃣3️⃣', color:'#FF9033', bg:'linear-gradient(135deg,#FF9033,#FF6B52)',
        title:'Uno, Dos, Tres', subtitle:'¡Repite!', text:'U-NO, DOS, TRES... ¡así se cuenta!', secs:35 },
      { emoji:'4️⃣5️⃣6️⃣', color:'#FF6B52', bg:'linear-gradient(135deg,#FF6B52,#FF9033)',
        title:'Cuatro, Cinco, Seis', subtitle:'¡Sigue contando!', text:'Cua-TRO, cin-CO, seis... ¡muy bien!', secs:35 },
      { emoji:'7️⃣8️⃣9️⃣🔟', color:'#FFD340', bg:'linear-gradient(135deg,#FF9033,#FFD340)',
        title:'Hasta el Diez', subtitle:'¡Ya casi!', text:'sie-TE, o-CHO, nue-VE, die-Z...', secs:35 },
      { emoji:'🎉', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FF9033)',
        title:'¡Lo Logramos!', subtitle:'¡Contaste hasta 10!', text:'¡Eres un experto en números!', secs:30 },
    ]
  },
  { id:14, emoji:'🗺️', thumbGradient:'linear-gradient(135deg,#1A5888,#2A8FC0 45%,#1E6E90)',
    title:'El Capitán Capibara y el Mapa del Tesoro', date:'2026-10-16', dayLabel:'Viernes, 16 Oct',
    category:'a', categoryLabel:'Aventura',
    description:'El Capitán Capibara encuentra un viejo mapa con marcas misteriosas.',
    tags:['capibara','tesoro','aventura','mapa'], duration:'11:00',
    scenes:[
      { emoji:'🦫', color:'#1A5888', bg:'linear-gradient(135deg,#1A5888,#2A8FC0)',
        title:'El Capitán Capibara', subtitle:'¡Hola, aventureros!', text:'El Capitán está listo para una nueva aventura.', secs:65 },
      { emoji:'🗺️', color:'#2A8FC0', bg:'linear-gradient(135deg,#2A8FC0,#1E6E90)',
        title:'El Mapa Misterioso', subtitle:'¡Lo encontré!', text:'Un viejo mapa con marcas misteriosas.', secs:65 },
      { emoji:'🏝️', color:'#1E6E90', bg:'linear-gradient(135deg,#1E6E90,#2A8FC0)',
        title:'La Primera Isla', subtitle:'¡La cruz azul!', text:'La primera marca lleva a una isla de palmeras.', secs:65 },
      { emoji:'🌋', color:'#1A5888', bg:'linear-gradient(135deg,#2A8FC0,#1A5888)',
        title:'El Volcán Humeante', subtitle:'¡Con cuidado!', text:'La segunda marca es el volcán colorido.', secs:65 },
      { emoji:'💎', color:'#2A8FC0', bg:'linear-gradient(135deg,#1E6E90,#2A8FC0 50%,#FFD340)',
        title:'¡El Tesoro!', subtitle:'¡Lo encontré!', text:'El tesoro son diamantes de colores brillantes.', secs:65 },
      { emoji:'🦫🌟', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FF9033)',
        title:'¡El Mejor Tesoro!', subtitle:'La aventura en sí', text:'El mejor tesoro es vivir la aventura.', secs:50 },
      { emoji:'⚓', color:'#1A5888', bg:'linear-gradient(135deg,#1A5888,#2A8FC0)',
        title:'¡Hasta la Próxima!', subtitle:'¡Nos vemos, amigos!', text:'¡El Capitán Capibara volverá pronto!', secs:45 },
    ]
  },
  { id:15, emoji:'🌽', thumbGradient:'linear-gradient(135deg,#2A9090,#3880C0 40%,#4060A0)',
    title:'El Detective Ornitorrinco: El Maíz Desaparecido', date:'2026-10-20', dayLabel:'Martes, 20 Oct',
    category:'h', categoryLabel:'Historia',
    description:'¡Todo el maíz de la granja desapareció durante la noche! El detective Ornitorrinco investiga.',
    tags:['ornitorrinco','misterio','granja','investigar'], duration:'10:15',
    scenes:[
      { emoji:'🦆', color:'#2A9090', bg:'linear-gradient(135deg,#2A9090,#3880C0)',
        title:'El Gran Misterio', subtitle:'¡El maíz! ¿Dónde está?', text:'Toda la granja está preocupada.', secs:60 },
      { emoji:'🌽', color:'#3880C0', bg:'linear-gradient(135deg,#3880C0,#4060A0)',
        title:'La Escena del Crimen', subtitle:'Rastros por doquier', text:'El detective busca pistas en el maizal.', secs:60 },
      { emoji:'🔍', color:'#4060A0', bg:'linear-gradient(135deg,#4060A0,#2A9090)',
        title:'Las Pistas', subtitle:'¡Hay huellas!', text:'Pequeñas huellas llevan al granero.', secs:60 },
      { emoji:'🐭', color:'#2A9090', bg:'linear-gradient(135deg,#2A9090,#7EC850)',
        title:'¡El Culpable!', subtitle:'¡Son los ratones!', text:'Los ratoncitos tenían hambre y tomaron el maíz.', secs:60 },
      { emoji:'🤝', color:'#3880C0', bg:'linear-gradient(135deg,#3880C0,#2A9090)',
        title:'La Solución', subtitle:'¡Compartamos!', text:'Todos compartirán el maíz con los ratones.', secs:60 },
      { emoji:'🦆🌽', color:'#2A9090', bg:'linear-gradient(135deg,#2A9090,#3880C0)',
        title:'¡Caso Cerrado!', subtitle:'¡El detective lo hizo!', text:'La justicia y el amor resuelven todo.', secs:45 },
    ]
  },
  { id:16, emoji:'🔷', thumbGradient:'linear-gradient(135deg,#FF6B8A,#9B7FE8 50%,#4EC9E8)',
    title:'Las Formas Geométricas con los Animales', date:'2026-10-23', dayLabel:'Viernes, 23 Oct',
    category:'e', categoryLabel:'Educativo',
    description:'El círculo de la luna, el triángulo del tejado del granero... ¡Los animales enseñan las formas!',
    tags:['formas','geometría','animales','educativo'], duration:'7:20',
    scenes:[
      { emoji:'⭕', color:'#FF6B8A', bg:'linear-gradient(135deg,#FF6B8A,#FFB3C6)',
        title:'El Círculo', subtitle:'¡Como la luna!', text:'CÍRCULO — redondo como la luna llena.', secs:40 },
      { emoji:'🔺', color:'#9B7FE8', bg:'linear-gradient(135deg,#9B7FE8,#B080F0)',
        title:'El Triángulo', subtitle:'¡Como el techo!', text:'TRIÁNGULO — como el tejado del granero.', secs:40 },
      { emoji:'⬜', color:'#4EC9E8', bg:'linear-gradient(135deg,#4EC9E8,#87CEEB)',
        title:'El Cuadrado', subtitle:'¡Como la ventana!', text:'CUADRADO — como la ventana de la granja.', secs:40 },
      { emoji:'⬛', color:'#9B7FE8', bg:'linear-gradient(135deg,#9B7FE8,#4EC9E8)',
        title:'El Rectángulo', subtitle:'¡Como la puerta!', text:'RECTÁNGULO — como la puerta del granero.', secs:40 },
      { emoji:'🔷', color:'#FF6B8A', bg:'linear-gradient(135deg,#FF6B8A,#9B7FE8 50%,#4EC9E8)',
        title:'¡Las Formas!', subtitle:'¿Cuántas ves?', text:'Círculo, triángulo, cuadrado, rectángulo.', secs:35 },
    ]
  },
  { id:17, emoji:'🐣', thumbGradient:'linear-gradient(135deg,#FFD340,#FF9033 55%,#FFC880)',
    title:'El Pollito Pío Aprende los Colores', date:'2026-10-27', dayLabel:'Martes, 27 Oct',
    category:'e', categoryLabel:'Educativo',
    description:'El pollito Pío nace del huevo y descubre el mundo lleno de colores nuevos.',
    tags:['pollito','colores','aprender','huevo'], duration:'7:55',
    scenes:[
      { emoji:'🥚', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FFC880)',
        title:'El Huevo Mágico', subtitle:'¡Algo se mueve!', text:'El huevo tiembla... ¡alguien va a nacer!', secs:44 },
      { emoji:'🐣', color:'#FF9033', bg:'linear-gradient(135deg,#FF9033,#FFD340)',
        title:'¡Nace Pío!', subtitle:'¡Hola mundo!', text:'Pío sale del huevo y ve el mundo por primera vez.', secs:44 },
      { emoji:'🔴', color:'#FF3333', bg:'linear-gradient(135deg,#FF3333,#FF6666)',
        title:'El Color Rojo', subtitle:'¡Rojo!', text:'ROJO — como la cresta del gallo.', secs:44 },
      { emoji:'💛', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FFF0A0)',
        title:'El Color Amarillo', subtitle:'¡Amarillo!', text:'AMARILLO — como su propio pelaje suave.', secs:44 },
      { emoji:'💚', color:'#7EC850', bg:'linear-gradient(135deg,#7EC850,#5BB3E0)',
        title:'El Color Verde', subtitle:'¡Verde!', text:'VERDE — como el pasto donde vive.', secs:40 },
    ]
  },
  { id:18, emoji:'🎃', thumbGradient:'linear-gradient(135deg,#6B3FA0,#A03800 45%,#FF8020)',
    title:'Halloween en la Granja: ¡Los Disfraces! 🕷️', date:'2026-10-30', dayLabel:'Viernes, 30 Oct',
    category:'s', categoryLabel:'Especial',
    description:'¡Los animales de la granja se disfrazan para Halloween! La vaca de bruja, el cerdo de fantasma...',
    tags:['halloween','disfraces','animales','especial'], duration:'8:40',
    scenes:[
      { emoji:'🎃', color:'#6B3FA0', bg:'linear-gradient(135deg,#6B3FA0,#A03800)',
        title:'¡Es Halloween!', subtitle:'¡La noche más divertida!', text:'La granja se llena de sustos y risas.', secs:50 },
      { emoji:'🐄🧙', color:'#A03800', bg:'linear-gradient(135deg,#A03800,#FF8020)',
        title:'La Vaca Bruja', subtitle:'¡Hechizo de leche!', text:'La vaca se disfrazó de bruja con sombrero.', secs:50 },
      { emoji:'🐷👻', color:'#FF8020', bg:'linear-gradient(135deg,#FF8020,#6B3FA0)',
        title:'El Cerdo Fantasma', subtitle:'¡BUU!', text:'El cerdito es el fantasma más chistoso.', secs:50 },
      { emoji:'🦆🧛', color:'#6B3FA0', bg:'linear-gradient(135deg,#6B3FA0,#A03800)',
        title:'El Pato Vampiro', subtitle:'¡Graaac graaac!', text:'El pato quiere ser el vampiro del estanque.', secs:50 },
      { emoji:'🐑🧟', color:'#A03800', bg:'linear-gradient(135deg,#A03800,#FF8020)',
        title:'La Oveja Momia', subtitle:'¡Oooooh!', text:'La oveja Esponjosa está envuelta en vendas.', secs:40 },
    ]
  },
  { id:19, emoji:'🫏', thumbGradient:'linear-gradient(135deg,#FF9033,#FFD340 50%,#FFF0A0)',
    title:'El Burro Sabio y los Números Mágicos', date:'2026-11-03', dayLabel:'Martes, 3 Nov',
    category:'e', categoryLabel:'Educativo',
    description:'El burro Sócrates conoce todos los números hasta el 20. Con su magia especial, ¡aprender a contar se convierte en un juego!',
    tags:['burro','números','contar','magia'], duration:'8:25',
    scenes:[
      { emoji:'🫏', color:'#FF9033', bg:'linear-gradient(135deg,#FF9033,#FFD340)',
        title:'Sócrates el Burro', subtitle:'¡El más sabio!', text:'Sócrates conoce todos los secretos de los números.', secs:48 },
      { emoji:'1️⃣0️⃣', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FFF0A0)',
        title:'Del 1 al 10', subtitle:'¡Ya los sabes!', text:'Uno, dos, tres... ¡ya los conocemos!', secs:48 },
      { emoji:'1️⃣1️⃣', color:'#FF9033', bg:'linear-gradient(135deg,#FF9033,#FFD340)',
        title:'El 11 y el 12', subtitle:'¡Números nuevos!', text:'ONCE y DOCE — ¡dos números mágicos!', secs:48 },
      { emoji:'1️⃣5️⃣', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FF9033)',
        title:'Hasta el 15', subtitle:'¡Contamos más!', text:'Trece, catorce, quince... ¡qué fácil!', secs:48 },
      { emoji:'2️⃣0️⃣✨', color:'#FF9033', bg:'linear-gradient(135deg,#FF9033,#FFD340 50%,#FFF0A0)',
        title:'¡Hasta el 20!', subtitle:'¡Lo logramos!', text:'¡Dieciséis, diecisiete, dieciocho, diecinueve, VEINTE!', secs:45 },
    ]
  },
  { id:20, emoji:'🥚', thumbGradient:'linear-gradient(135deg,#FFD5B0,#FFF0A0 50%,#FFEDCC)',
    title:'La Gallina Clotilde y los Huevos de Colores', date:'2026-11-06', dayLabel:'Viernes, 6 Nov',
    category:'h', categoryLabel:'Historia',
    description:'La gallina Clotilde pone un huevo de cada color y cada uno tiene una sorpresa especial dentro.',
    tags:['gallina','huevos','colores','sorpresa'], duration:'9:00',
    scenes:[
      { emoji:'🐔', color:'#FFD5B0', bg:'linear-gradient(135deg,#FFD5B0,#FFF0A0)',
        title:'Clotilde la Gallina', subtitle:'¡Mis huevos!', text:'Clotilde es la gallina más especial de la granja.', secs:52 },
      { emoji:'🔴🥚', color:'#FF6666', bg:'linear-gradient(135deg,#FF6666,#FF9999)',
        title:'El Huevo Rojo', subtitle:'¿Qué hay dentro?', text:'Dentro hay... ¡una manzana brillante!', secs:52 },
      { emoji:'💛🥚', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FFF0A0)',
        title:'El Huevo Amarillo', subtitle:'¡Una sorpresa!', text:'Dentro hay... ¡un pollito sonriente!', secs:52 },
      { emoji:'💙🥚', color:'#4EC9E8', bg:'linear-gradient(135deg,#4EC9E8,#87CEEB)',
        title:'El Huevo Azul', subtitle:'¡Oh!', text:'Dentro hay... ¡una mariposa de plumas!', secs:52 },
      { emoji:'🌟🥚', color:'#FFD340', bg:'linear-gradient(135deg,#FFD5B0,#FFD340)',
        title:'¡Cada Huevo es Único!', subtitle:'Como tú', text:'Cada huevo tiene algo especial, como tú.', secs:42 },
    ]
  },
  { id:21, emoji:'⛈️', thumbGradient:'linear-gradient(135deg,#1A4870,#2A3D8C 45%,#1A3060)',
    title:'El Capitán Capibara en la Gran Tormenta', date:'2026-11-10', dayLabel:'Martes, 10 Nov',
    category:'a', categoryLabel:'Aventura',
    description:'Una tormenta enorme sorprende al Capitán Capibara en alta mar.',
    tags:['capibara','tormenta','valentía','aventura'], duration:'10:30',
    scenes:[
      { emoji:'🦫', color:'#1A4870', bg:'linear-gradient(135deg,#1A4870,#2A3D8C)',
        title:'El Capitán en el Mar', subtitle:'Todo tranquilo...', text:'El Capitán Capibara navega feliz.', secs:62 },
      { emoji:'⛈️', color:'#2A3D8C', bg:'linear-gradient(135deg,#2A3D8C,#1A3060)',
        title:'¡La Tormenta!', subtitle:'¡De repente!', text:'Nubes oscuras cubren el cielo.', secs:62 },
      { emoji:'🌊', color:'#1A3060', bg:'linear-gradient(135deg,#1A3060,#1A4870)',
        title:'Las Olas Gigantes', subtitle:'¡Aguanta fuerte!', text:'Olas enormes sacuden el barco.', secs:62 },
      { emoji:'⚡', color:'#2A3D8C', bg:'linear-gradient(135deg,#1A4870,#2A3D8C)',
        title:'Los Rayos', subtitle:'¡Flash!', text:'Los rayos iluminan el cielo oscuro.', secs:62 },
      { emoji:'🌈', color:'#4EC9E8', bg:'linear-gradient(135deg,#2A3D8C,#4EC9E8)',
        title:'La Tormenta Pasa', subtitle:'¡Un arcoíris!', text:'Después de la tormenta, siempre hay un arcoíris.', secs:62 },
      { emoji:'🦫🌟', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FF9033)',
        title:'¡Valiente!', subtitle:'¡El Capitán lo logró!', text:'La valentía supera cualquier tormenta.', secs:50 },
      { emoji:'⚓', color:'#1A4870', bg:'linear-gradient(135deg,#1A4870,#2A3D8C)',
        title:'¡Hasta la próxima!', subtitle:'¡El Capitán regresa!', text:'¡Nuevas aventuras esperan!', secs:40 },
    ]
  },
  { id:22, emoji:'🍂', thumbGradient:'linear-gradient(135deg,#D4853A,#A85820 45%,#8B4520)',
    title:'Los Animales en Otoño | ¿Dónde Van?', date:'2026-11-13', dayLabel:'Viernes, 13 Nov',
    category:'e', categoryLabel:'Educativo',
    description:'¿Por qué los pájaros vuelan lejos en otoño? ¿Por qué los osos duermen tanto?',
    tags:['otoño','animales','naturaleza','estaciones'], duration:'8:10',
    scenes:[
      { emoji:'🍂', color:'#D4853A', bg:'linear-gradient(135deg,#D4853A,#A85820)',
        title:'¡Llega el Otoño!', subtitle:'Las hojas caen...', text:'Las hojas se vuelven rojas, amarillas y naranjas.', secs:46 },
      { emoji:'🦅', color:'#A85820', bg:'linear-gradient(135deg,#A85820,#D4853A)',
        title:'Las Aves Viajan', subtitle:'¡Adiós por ahora!', text:'Los pájaros vuelan a países más cálidos.', secs:46 },
      { emoji:'🐻', color:'#8B4520', bg:'linear-gradient(135deg,#8B4520,#A85820)',
        title:'El Oso Duerme', subtitle:'Hibernación', text:'El oso come mucho y luego duerme todo el invierno.', secs:46 },
      { emoji:'🐿️', color:'#D4853A', bg:'linear-gradient(135deg,#A85820,#D4853A)',
        title:'La Ardilla Guarda', subtitle:'¡Provisiones!', text:'La ardilla esconde bellotas para el invierno.', secs:46 },
      { emoji:'🍂🌟', color:'#A85820', bg:'linear-gradient(135deg,#D4853A,#A85820 50%,#8B4520)',
        title:'El Ciclo de las Estaciones', subtitle:'Cada estación es hermosa', text:'La naturaleza cambia con cada estación.', secs:40 },
    ]
  },
  { id:23, emoji:'🔤', thumbGradient:'linear-gradient(135deg,#FF6B8A,#FFD340 35%,#4EC9E8 65%,#9B7FE8)',
    title:'El Abecedario de la Granja: A, B, C...', date:'2026-11-17', dayLabel:'Martes, 17 Nov',
    category:'e', categoryLabel:'Educativo',
    description:'A de Asno, B de Burro, C de Caballo... ¡Los animales de la granja enseñan todo el abecedario!',
    tags:['abecedario','letras','animales','educativo'], duration:'9:45',
    scenes:[
      { emoji:'🅰️🫏', color:'#FF6B8A', bg:'linear-gradient(135deg,#FF6B8A,#FF9999)',
        title:'A, B, C', subtitle:'¡Las primeras letras!', text:'A de Asno, B de Burro, C de Caballo.', secs:56 },
      { emoji:'🐕🦆🐘', color:'#FFD340', bg:'linear-gradient(135deg,#FFD340,#FF9033)',
        title:'D, E, F', subtitle:'¡Más letras!', text:'D de Donkey, E de Elefante, F de Foca.', secs:56 },
      { emoji:'🐓🐎🐴', color:'#4EC9E8', bg:'linear-gradient(135deg,#4EC9E8,#87CEEB)',
        title:'G, H, I', subtitle:'¡Seguimos!', text:'G de Gallo, H de Hipopótamo, I de Iguana.', secs:56 },
      { emoji:'🦆🦘🦁', color:'#9B7FE8', bg:'linear-gradient(135deg,#9B7FE8,#B080F0)',
        title:'J, K, L', subtitle:'¡Casi la mitad!', text:'J de Jaguar, K de Koala, L de León.', secs:56 },
      { emoji:'🔤✨', color:'#FF6B8A', bg:'linear-gradient(135deg,#FF6B8A,#FFD340 35%,#4EC9E8 65%,#9B7FE8)',
        title:'¡El Abecedario!', subtitle:'A, B, C... ¡lo sé!', text:'Con los animales aprendemos todas las letras.', secs:45 },
    ]
  },
  { id:24, emoji:'❄️', thumbGradient:'linear-gradient(135deg,#9ADCF0,#6BA0D0 45%,#4878C0)',
    title:'El Detective Ornitorrinco y el Río Congelado', date:'2026-11-20', dayLabel:'Viernes, 20 Nov',
    category:'h', categoryLabel:'Historia',
    description:'El río de la granja se congeló y los patos no pueden nadar. El detective Ornitorrinco debe resolver el misterio.',
    tags:['ornitorrinco','invierno','misterio','río'], duration:'10:00',
    scenes:[
      { emoji:'❄️', color:'#9ADCF0', bg:'linear-gradient(135deg,#9ADCF0,#6BA0D0)',
        title:'¡El Río Congelado!', subtitle:'¡Todo es hielo!', text:'El río de la granja está cubierto de hielo.', secs:58 },
      { emoji:'🦆', color:'#6BA0D0', bg:'linear-gradient(135deg,#6BA0D0,#4878C0)',
        title:'Los Patos Tristes', subtitle:'No podemos nadar...', text:'Los patos no pueden nadar sin agua.', secs:58 },
      { emoji:'🔍', color:'#4878C0', bg:'linear-gradient(135deg,#4878C0,#9ADCF0)',
        title:'El Detective Investiga', subtitle:'¿Por qué se congeló?', text:'El detective usa su lupa en el hielo.', secs:58 },
      { emoji:'🌡️', color:'#9ADCF0', bg:'linear-gradient(135deg,#9ADCF0,#6BA0D0)',
        title:'La Ciencia del Frío', subtitle:'¡El agua se congela!', text:'Cuando hace muy frío, el agua se vuelve hielo.', secs:58 },
      { emoji:'☀️', color:'#FFD340', bg:'linear-gradient(135deg,#4878C0,#87CEEB 50%,#FFD340)',
        title:'El Sol Derrite el Hielo', subtitle:'¡El río vuelve!', text:'Con el sol, el hielo se derrite y el río fluye.', secs:58 },
      { emoji:'🦆🌊', color:'#6BA0D0', bg:'linear-gradient(135deg,#9ADCF0,#6BA0D0)',
        title:'¡Los Patos Nadan!', subtitle:'¡Misión cumplida!', text:'El detective resolvió el misterio del invierno.', secs:50 },
    ]
  },
];

function parseDuration(str) {
  const [m, s] = str.split(':').map(Number);
  return m * 60 + s;
}

function makeComposition(video) {
  const totalSecs = parseDuration(video.duration);
  const id = `v${String(video.id).padStart(2, '0')}`;

  // Time allocation:
  // 0-8: channel intro
  // 8-18: title card
  // content scenes: evenly distributed
  // last 16s: recap
  // last 8s (within last 16): outro (overlap)

  const INTRO_DUR = 8;
  const TITLE_DUR = 10;
  const OUTRO_START = totalSecs - 10;
  const RECAP_START = totalSecs - 18;

  let currentTime = 18;
  const scenes = video.scenes;

  // Calculate scene timings
  const contentTime = RECAP_START - 18;
  const sceneTimes = [];

  if (scenes.length > 0) {
    // Distribute scenes proportionally based on their secs
    const totalSceneSecs = scenes.reduce((a, s) => a + s.secs, 0);
    let t = 18;
    for (const scene of scenes) {
      const dur = Math.round((scene.secs / totalSceneSecs) * contentTime);
      sceneTimes.push({ start: t, dur });
      t += dur;
    }
  }

  const catColors = {
    e: { bg: '#E0F4FF', text: '#1565C0', label: 'Educativo' },
    h: { bg: '#F3E8FF', text: '#6A1B9A', label: 'Historia' },
    c: { bg: '#FFF8E1', text: '#E65100', label: 'Canción' },
    a: { bg: '#E8F5E9', text: '#2E7D32', label: 'Aventura' },
    s: { bg: '#FCE4EC', text: '#880E4F', label: 'Especial' },
  };
  const cat = catColors[video.category] || catColors.e;

  // Build GSAP animation blocks for each scene
  let gsapBlocks = '';

  // Intro scene (0-8s)
  gsapBlocks += `
  // Intro
  tl.set('#s-intro', { autoAlpha: 0 }, 0);
  tl.to('#s-intro', { autoAlpha: 1, duration: 0.5 }, 0.2);
  tl.to('#s-intro-logo', { scale: 1, duration: 0.6, ease: 'back.out(2)' }, 0.3);
  tl.to('#s-intro-tagline', { autoAlpha: 1, y: 0, duration: 0.5 }, 0.8);
  tl.to('#s-intro', { autoAlpha: 0, duration: 0.4 }, ${INTRO_DUR - 0.5});`;

  // Title card (8-18s)
  gsapBlocks += `

  // Title card
  tl.set('#s-title', { autoAlpha: 0 }, ${INTRO_DUR});
  tl.to('#s-title', { autoAlpha: 1, duration: 0.5 }, ${INTRO_DUR + 0.1});
  tl.to('#s-title-emoji', { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.6)' }, ${INTRO_DUR + 0.3});
  tl.to('#s-title-text', { autoAlpha: 1, y: 0, duration: 0.6 }, ${INTRO_DUR + 0.7});
  tl.to('#s-title-cat', { autoAlpha: 1, duration: 0.4 }, ${INTRO_DUR + 1.2});
  tl.to('#s-title', { autoAlpha: 0, duration: 0.4 }, ${INTRO_DUR + TITLE_DUR - 0.5});`;

  // Content scenes
  scenes.forEach((scene, i) => {
    const sIdx = i + 1;
    const st = sceneTimes[i];
    if (!st) return;
    const { start, dur } = st;

    gsapBlocks += `

  // Scene ${sIdx}: ${scene.title}
  tl.set('#s${sIdx}', { autoAlpha: 0 }, ${start});
  tl.to('#s${sIdx}', { autoAlpha: 1, duration: 0.5 }, ${start + 0.1});
  tl.to('#s${sIdx}-emoji', { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.7)' }, ${start + 0.3});
  tl.to('#s${sIdx}-title', { autoAlpha: 1, y: 0, duration: 0.5 }, ${start + 0.6});
  tl.to('#s${sIdx}-sub', { autoAlpha: 1, duration: 0.4 }, ${start + 0.9});
  tl.to('#s${sIdx}-text', { autoAlpha: 1, y: 0, duration: 0.5 }, ${start + 1.2});
  tl.to('#s${sIdx}-emoji', { y: -8, duration: 1.5, yoyo: true, repeat: ${Math.min(Math.floor((dur - 2) / 3), 8)}, ease: 'sine.inOut' }, ${start + 1.5});
  tl.to('#s${sIdx}', { autoAlpha: 0, duration: 0.4 }, ${start + dur - 0.5});`;
  });

  // Recap scene
  gsapBlocks += `

  // Recap
  tl.set('#s-recap', { autoAlpha: 0 }, ${RECAP_START});
  tl.to('#s-recap', { autoAlpha: 1, duration: 0.5 }, ${RECAP_START + 0.1});
  tl.to('#s-recap-emoji', { scale: 1, duration: 0.7, ease: 'back.out(2)' }, ${RECAP_START + 0.3});
  tl.to('#s-recap-title', { autoAlpha: 1, y: 0, duration: 0.5 }, ${RECAP_START + 0.7});
  tl.to('#s-recap', { autoAlpha: 0, duration: 0.4 }, ${OUTRO_START - 0.5});

  // Outro
  tl.set('#s-outro', { autoAlpha: 0 }, ${OUTRO_START});
  tl.to('#s-outro', { autoAlpha: 1, duration: 0.5 }, ${OUTRO_START + 0.1});
  tl.to('#s-outro-logo', { scale: 1, duration: 0.6, ease: 'back.out(2)' }, ${OUTRO_START + 0.3});
  tl.to('#s-outro-sub', { autoAlpha: 1, y: 0, duration: 0.5 }, ${OUTRO_START + 0.8});`;

  // Build scene HTML
  let sceneHtml = '';

  // Content scenes HTML
  scenes.forEach((scene, i) => {
    const sIdx = i + 1;
    const st = sceneTimes[i];
    if (!st) return;
    const { start, dur } = st;

    sceneHtml += `
  <!-- Scene ${sIdx}: ${scene.title} -->
  <div id="s${sIdx}" class="clip" data-start="${start}" data-duration="${dur}" data-track-index="1"
       style="background:${scene.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:40px;">
    <div id="s${sIdx}-emoji" style="font-size:100px;line-height:1">${scene.emoji}</div>
    <div id="s${sIdx}-title" style="font-family:'Nunito',sans-serif;font-size:42px;font-weight:900;color:#1A2060;text-align:center;text-shadow:0 2px 8px rgba(0,0,0,0.15)">${scene.title}</div>
    <div id="s${sIdx}-sub" style="font-family:'Nunito',sans-serif;font-size:56px;font-weight:900;color:#FFD340;text-align:center;text-shadow:0 3px 12px rgba(0,0,0,0.3)">${scene.subtitle}</div>
    <div id="s${sIdx}-text" style="font-family:'Nunito',sans-serif;font-size:28px;font-weight:700;color:#fff;text-align:center;background:rgba(0,0,0,0.25);border-radius:16px;padding:16px 32px;max-width:80%">${scene.text}</div>
  </div>`;
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${video.title} | JoyMannersKids</title>
  <style>
    @font-face {
      font-family: 'Arial Rounded MT Bold';
      src: local('Arial Rounded MT Bold');
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { width: 1280px; height: 720px; overflow: hidden; background: #000; }
    .clip {
      position: absolute;
      inset: 0;
      width: 1280px;
      height: 720px;
    }
  </style>
</head>
<body>
  <div data-composition-id="${id}" data-width="1280" data-height="720" data-duration="${totalSecs}"
       style="position:relative;width:1280px;height:720px;overflow:hidden;background:#FFD340;">

    <!-- Channel Intro 0-${INTRO_DUR}s -->
    <div id="s-intro" class="clip" data-start="0" data-duration="${INTRO_DUR}" data-track-index="1"
         style="background:linear-gradient(110deg,#FFD340,#FFAA18);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;">
      <div id="s-intro-logo" style="font-size:90px">❤️</div>
      <div style="font-family:'Nunito',sans-serif;font-size:52px;font-weight:900;color:#3E1C00;text-align:center">JoyMannersKids</div>
      <div id="s-intro-tagline" style="font-family:'Nunito',sans-serif;font-size:24px;font-weight:700;color:#7A4000">Aprender es divertido ❤️</div>
    </div>

    <!-- Title Card ${INTRO_DUR}-${INTRO_DUR + TITLE_DUR}s -->
    <div id="s-title" class="clip" data-start="${INTRO_DUR}" data-duration="${TITLE_DUR}" data-track-index="1"
         style="background:${video.thumbGradient};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:40px;opacity:0;">
      <div id="s-title-emoji" style="font-size:90px;line-height:1">${video.emoji}</div>
      <div id="s-title-text" style="font-family:'Nunito',sans-serif;font-size:38px;font-weight:900;color:#1A2060;text-align:center;max-width:90%">${video.title}</div>
      <div id="s-title-cat" style="font-family:'Nunito',sans-serif;font-size:20px;font-weight:700;color:${cat.text};background:${cat.bg};padding:8px 24px;border-radius:50px">${cat.label}</div>
    </div>

${sceneHtml}

    <!-- Recap -->
    <div id="s-recap" class="clip" data-start="${RECAP_START}" data-duration="${OUTRO_START - RECAP_START + 1}" data-track-index="1"
         style="background:linear-gradient(135deg,#FFD340,#FF9033 50%,#FF6B52);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;opacity:0;">
      <div id="s-recap-emoji" style="font-size:80px">⭐</div>
      <div id="s-recap-title" style="font-family:'Nunito',sans-serif;font-size:44px;font-weight:900;color:#1A2060;text-align:center">¡Aprendiste mucho hoy!</div>
    </div>

    <!-- Outro -->
    <div id="s-outro" class="clip" data-start="${OUTRO_START}" data-duration="${totalSecs - OUTRO_START}" data-track-index="1"
         style="background:linear-gradient(110deg,#FFD340,#FFAA18);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;opacity:0;">
      <div id="s-outro-logo" style="font-size:80px">❤️</div>
      <div style="font-family:'Nunito',sans-serif;font-size:42px;font-weight:900;color:#3E1C00">JoyMannersKids</div>
      <div id="s-outro-sub" style="font-family:'Nunito',sans-serif;font-size:24px;font-weight:700;color:#7A4000">¡Suscríbete y activa la 🔔!</div>
    </div>

  </div>

  <script src="node_modules/gsap/dist/gsap.min.js"></script>
  <script>
    window.__timelines = window.__timelines || {};

    gsap.set('#s-intro', { autoAlpha: 1 });
    gsap.set('#s-intro-logo', { scale: 0 });
    gsap.set('#s-intro-tagline', { autoAlpha: 0, y: 10 });
    gsap.set('#s-title', { autoAlpha: 0 });
    gsap.set('#s-title-emoji', { scale: 0 });
    gsap.set('#s-title-text', { autoAlpha: 0, y: 20 });
    gsap.set('#s-title-cat', { autoAlpha: 0 });
    gsap.set('#s-recap', { autoAlpha: 0 });
    gsap.set('#s-recap-emoji', { scale: 0 });
    gsap.set('#s-recap-title', { autoAlpha: 0, y: 20 });
    gsap.set('#s-outro', { autoAlpha: 0 });
    gsap.set('#s-outro-logo', { scale: 0 });
    gsap.set('#s-outro-sub', { autoAlpha: 0, y: 10 });
    ${scenes.map((_, i) => {
      const sIdx = i + 1;
      return `gsap.set('#s${sIdx}', { autoAlpha: 0 });\n    gsap.set('#s${sIdx}-emoji', { scale: 0 });\n    gsap.set('#s${sIdx}-title', { autoAlpha: 0, y: 20 });\n    gsap.set('#s${sIdx}-sub', { autoAlpha: 0 });\n    gsap.set('#s${sIdx}-text', { autoAlpha: 0, y: 15 });`;
    }).join('\n    ')}

    const tl = gsap.timeline({ paused: true });
    ${gsapBlocks}

    window.__timelines['${id}'] = tl;
  </script>
</body>
</html>`;
}

// Generate all compositions
const outDir = path.join(__dirname, 'compositions');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const video of SCHEDULE) {
  const filename = `v${String(video.id).padStart(2, '0')}.html`;
  const html = makeComposition(video);
  fs.writeFileSync(path.join(outDir, filename), html, 'utf8');
  console.log(`✓ Generated compositions/${filename} — ${video.title} (${video.duration})`);
}

// Copy v01 as the default index.html
fs.copyFileSync(path.join(outDir, 'v01.html'), path.join(__dirname, 'index.html'));
console.log('✓ Copied compositions/v01.html → index.html');

console.log('\nDone! Generated', SCHEDULE.length, 'compositions in compositions/');
