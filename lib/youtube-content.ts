export type VideoCategory = 'e' | 'h' | 'c' | 'a' | 's'

export interface ScheduledVideo {
  id: number
  emoji: string
  thumbGradient: string
  title: string
  date: string        // YYYY-MM-DD
  dayLabel: string
  category: VideoCategory
  categoryLabel: string
  description: string
  tags: string[]
  duration: string
}

export const CATEGORY_LABELS: Record<VideoCategory, string> = {
  e: 'Educativo',
  h: 'Historia',
  c: 'Canción',
  a: 'Aventura',
  s: 'Especial',
}

export const SCHEDULE: ScheduledVideo[] = [
  { id:1,  emoji:'🐄', thumbGradient:'linear-gradient(135deg,#87CEEB,#5BB3E0 45%,#7EC850)',
    title:'Los Sonidos de los Animales de la Granja',
    date:'2026-09-01', dayLabel:'Martes, 1 Sep', category:'e', categoryLabel:'Educativo',
    description:'Los pequeños aprenden los sonidos de la vaca, el cerdo, el gallo y el caballo. Con canciones y colores brillantes, ¡cada animal tiene su propia voz!',
    tags:['animales','sonidos','granja','educativo'], duration:'8:45' },

  { id:2,  emoji:'🐮', thumbGradient:'linear-gradient(135deg,#9B7FE8,#C860A0 45%,#FF9066)',
    title:'La Vaca y la Gran Piñata de la Granja',
    date:'2026-09-04', dayLabel:'Viernes, 4 Sep', category:'h', categoryLabel:'Historia',
    description:'La vaca Lola organiza una piñata enorme con todos los animales de la granja. ¡Pero nadie puede romperla! ¿Quién lo logrará?',
    tags:['vaca','piñata','amigos','fiesta'], duration:'9:20' },

  { id:3,  emoji:'🦫', thumbGradient:'linear-gradient(135deg,#2A9FC8,#1878A8 40%,#0E5A88)',
    title:'El Capitán Capibara: ¡A Navegar! 🌊',
    date:'2026-09-08', dayLabel:'Martes, 8 Sep', category:'a', categoryLabel:'Aventura',
    description:'El valiente Capitán Capibara zarpa al mar con su pequeño barco de madera. Vientos fuertes, olas gigantes y mucha valentía.',
    tags:['capibara','mar','aventura','capitán'], duration:'10:05' },

  { id:4,  emoji:'🦆', thumbGradient:'linear-gradient(135deg,#2ABABA,#3880C0 45%,#2060A0)',
    title:'El Detective Ornitorrinco y el Huevo Perdido',
    date:'2026-09-11', dayLabel:'Viernes, 11 Sep', category:'h', categoryLabel:'Historia',
    description:'El detective Ornitorrinco recibe una misión urgente: ¡alguien escondió los huevos de la gallina! Ayuda a encontrarlos siguiendo las pistas.',
    tags:['ornitorrinco','detective','misterio','huevos'], duration:'9:55' },

  { id:5,  emoji:'🌈', thumbGradient:'linear-gradient(135deg,#FF6B8A,#FFD340 45%,#4EC9E8)',
    title:'Aprende los Colores con los Animales de la Granja',
    date:'2026-09-15', dayLabel:'Martes, 15 Sep', category:'e', categoryLabel:'Educativo',
    description:'El cerdo rosa, la vaca blanca, el caballo marrón y el pato amarillo enseñan todos los colores del arcoíris. ¡Aprende señalando!',
    tags:['colores','animales','educativo','aprende'], duration:'7:30' },

  { id:6,  emoji:'🐓', thumbGradient:'linear-gradient(135deg,#FF9033,#FFD340 55%,#FFF0A0)',
    title:'El Gallo Lorenzo Canta ¡Buenos Días! | Canción',
    date:'2026-09-18', dayLabel:'Viernes, 18 Sep', category:'c', categoryLabel:'Canción',
    description:'El gallo Lorenzo despierta a todos los animales con su canto cada mañana. ¡Aprende la canción de buenos días con él!',
    tags:['gallo','canción','mañana','despertar'], duration:'6:15' },

  { id:7,  emoji:'🔢', thumbGradient:'linear-gradient(135deg,#9B7FE8,#5BBDE8 50%,#4EC9E8)',
    title:'Los Números del 1 al 10 en la Granja',
    date:'2026-09-22', dayLabel:'Martes, 22 Sep', category:'e', categoryLabel:'Educativo',
    description:'Cuenta los pollitos, las vacas, los cerditos y más animales para aprender los números del 1 al 10 de forma divertida y musical.',
    tags:['números','contar','animales','educativo'], duration:'8:00' },

  { id:8,  emoji:'🐷', thumbGradient:'linear-gradient(135deg,#C8A075,#A07850 40%,#7EC850)',
    title:'El Cerdito Pepón y el Charco de Lodo',
    date:'2026-09-25', dayLabel:'Viernes, 25 Sep', category:'h', categoryLabel:'Historia',
    description:'El cerdito Pepón adora bañarse en el lodo pero sus amigos no entienden por qué. Una historia tierna sobre aceptar las diferencias.',
    tags:['cerdo','lodo','amigos','historia'], duration:'9:10' },

  { id:9,  emoji:'🦃', thumbGradient:'linear-gradient(135deg,#A0602A,#C88040 45%,#E8A060)',
    title:'El Pavo Don Tomás Aprende a Bailar',
    date:'2026-09-29', dayLabel:'Martes, 29 Sep', category:'c', categoryLabel:'Canción',
    description:'Don Tomás el pavo quiere bailar como sus amigos pero sus patas no lo obedecen. ¡Con práctica y alegría, todo se puede aprender!',
    tags:['pavo','bailar','canción','diversión'], duration:'7:50' },

  { id:10, emoji:'🐤', thumbGradient:'linear-gradient(135deg,#4EC9E8,#87CEEB 50%,#B0E8FF)',
    title:'El Patito Aprende a Nadar en el Estanque',
    date:'2026-10-02', dayLabel:'Viernes, 2 Oct', category:'h', categoryLabel:'Historia',
    description:'El patito pequeño tiene miedo del agua pero su mamá le enseña paso a paso. Una historia sobre valentía y confianza en uno mismo.',
    tags:['pato','nadar','estanque','valentía'], duration:'8:35' },

  { id:11, emoji:'🐑', thumbGradient:'linear-gradient(135deg,#E8B4D0,#C8B8F0 50%,#B0D8F8)',
    title:'La Oveja Esponjosa y su Lana Mágica',
    date:'2026-10-06', dayLabel:'Martes, 6 Oct', category:'h', categoryLabel:'Historia',
    description:'La ovejita Esponjosa descubre que su lana puede ser de todos los colores del arcoíris. Aprende colores mientras descubres ser tú mismo.',
    tags:['oveja','lana','colores','historia'], duration:'8:50' },

  { id:12, emoji:'🌙', thumbGradient:'linear-gradient(135deg,#4060C8,#6060A8 45%,#8060A8)',
    title:'El Caballo Valiente | Cuento para Dormir 🌟',
    date:'2026-10-09', dayLabel:'Viernes, 9 Oct', category:'h', categoryLabel:'Historia',
    description:'El caballo Bruno ayuda a todos los animales de noche. Un cuento suave y tierno con voz tranquila, perfecto para la hora de dormir.',
    tags:['caballo','dormir','cuento','noche'], duration:'7:45' },

  { id:13, emoji:'🎵', thumbGradient:'linear-gradient(135deg,#FFD340,#FF9033 45%,#FF6B52)',
    title:'Canta con los Animales: ¡Uno, Dos, Tres!',
    date:'2026-10-13', dayLabel:'Martes, 13 Oct', category:'c', categoryLabel:'Canción',
    description:'Los animales de la granja se unen para cantar y contar juntos del 1 al 20. ¡Una canción pegajosa que los peques amarán repetir!',
    tags:['canción','números','animales','música'], duration:'6:30' },

  { id:14, emoji:'🗺️', thumbGradient:'linear-gradient(135deg,#1A5888,#2A8FC0 45%,#1E6E90)',
    title:'El Capitán Capibara y el Mapa del Tesoro',
    date:'2026-10-16', dayLabel:'Viernes, 16 Oct', category:'a', categoryLabel:'Aventura',
    description:'El Capitán Capibara encuentra un viejo mapa con marcas misteriosas. ¡Navega con él a través de islas coloridas hacia el gran tesoro!',
    tags:['capibara','tesoro','aventura','mapa'], duration:'11:00' },

  { id:15, emoji:'🌽', thumbGradient:'linear-gradient(135deg,#2A9090,#3880C0 40%,#4060A0)',
    title:'El Detective Ornitorrinco: El Maíz Desaparecido',
    date:'2026-10-20', dayLabel:'Martes, 20 Oct', category:'h', categoryLabel:'Historia',
    description:'¡Todo el maíz de la granja desapareció durante la noche! El detective Ornitorrinco investiga con su lupa. ¿Quién lo tomó?',
    tags:['ornitorrinco','misterio','granja','investigar'], duration:'10:15' },

  { id:16, emoji:'🔷', thumbGradient:'linear-gradient(135deg,#FF6B8A,#9B7FE8 50%,#4EC9E8)',
    title:'Las Formas Geométricas con los Animales',
    date:'2026-10-23', dayLabel:'Viernes, 23 Oct', category:'e', categoryLabel:'Educativo',
    description:'El círculo de la luna, el triángulo del tejado del granero, el cuadrado de la ventana... ¡Los animales enseñan las formas con su cuerpo!',
    tags:['formas','geometría','animales','educativo'], duration:'7:20' },

  { id:17, emoji:'🐣', thumbGradient:'linear-gradient(135deg,#FFD340,#FF9033 55%,#FFC880)',
    title:'El Pollito Pío Aprende los Colores',
    date:'2026-10-27', dayLabel:'Martes, 27 Oct', category:'e', categoryLabel:'Educativo',
    description:'El pollito Pío nace del huevo y descubre el mundo lleno de colores nuevos. Rojo, azul, verde, amarillo... ¡Aprende con él!',
    tags:['pollito','colores','aprender','huevo'], duration:'7:55' },

  { id:18, emoji:'🎃', thumbGradient:'linear-gradient(135deg,#6B3FA0,#A03800 45%,#FF8020)',
    title:'Halloween en la Granja: ¡Los Disfraces! 🕷️',
    date:'2026-10-30', dayLabel:'Viernes, 30 Oct', category:'s', categoryLabel:'Especial',
    description:'¡Los animales de la granja se disfrazan para Halloween! La vaca de bruja, el cerdo de fantasma, el pato de vampiro y la oveja de momia.',
    tags:['halloween','disfraces','animales','especial'], duration:'8:40' },

  { id:19, emoji:'🫏', thumbGradient:'linear-gradient(135deg,#FF9033,#FFD340 50%,#FFF0A0)',
    title:'El Burro Sabio y los Números Mágicos',
    date:'2026-11-03', dayLabel:'Martes, 3 Nov', category:'e', categoryLabel:'Educativo',
    description:'El burro Sócrates conoce todos los números hasta el 20. Con su magia especial, ¡aprender a contar se convierte en un juego!',
    tags:['burro','números','contar','magia'], duration:'8:25' },

  { id:20, emoji:'🥚', thumbGradient:'linear-gradient(135deg,#FFD5B0,#FFF0A0 50%,#FFEDCC)',
    title:'La Gallina Clotilde y los Huevos de Colores',
    date:'2026-11-06', dayLabel:'Viernes, 6 Nov', category:'h', categoryLabel:'Historia',
    description:'La gallina Clotilde pone un huevo de cada color y cada uno tiene una sorpresa especial dentro. ¡Una historia llena de asombro!',
    tags:['gallina','huevos','colores','sorpresa'], duration:'9:00' },

  { id:21, emoji:'⛈️', thumbGradient:'linear-gradient(135deg,#1A4870,#2A3D8C 45%,#1A3060)',
    title:'El Capitán Capibara en la Gran Tormenta',
    date:'2026-11-10', dayLabel:'Martes, 10 Nov', category:'a', categoryLabel:'Aventura',
    description:'Una tormenta enorme sorprende al Capitán Capibara en alta mar. Olas gigantes, rayos y truenos. ¡Pero con valentía puede con todo!',
    tags:['capibara','tormenta','valentía','aventura'], duration:'10:30' },

  { id:22, emoji:'🍂', thumbGradient:'linear-gradient(135deg,#D4853A,#A85820 45%,#8B4520)',
    title:'Los Animales en Otoño | ¿Dónde Van?',
    date:'2026-11-13', dayLabel:'Viernes, 13 Nov', category:'e', categoryLabel:'Educativo',
    description:'¿Por qué los pájaros vuelan lejos en otoño? ¿Por qué los osos duermen tanto? Los animales explican las estaciones del año.',
    tags:['otoño','animales','naturaleza','estaciones'], duration:'8:10' },

  { id:23, emoji:'🔤', thumbGradient:'linear-gradient(135deg,#FF6B8A,#FFD340 35%,#4EC9E8 65%,#9B7FE8)',
    title:'El Abecedario de la Granja: A, B, C...',
    date:'2026-11-17', dayLabel:'Martes, 17 Nov', category:'e', categoryLabel:'Educativo',
    description:'A de Asno, B de Burro, C de Caballo... ¡Los animales de la granja enseñan todo el abecedario en español con canciones y rimas!',
    tags:['abecedario','letras','animales','educativo'], duration:'9:45' },

  { id:24, emoji:'❄️', thumbGradient:'linear-gradient(135deg,#9ADCF0,#6BA0D0 45%,#4878C0)',
    title:'El Detective Ornitorrinco y el Río Congelado',
    date:'2026-11-20', dayLabel:'Viernes, 20 Nov', category:'h', categoryLabel:'Historia',
    description:'El río de la granja se congeló y los patos no pueden nadar. El detective Ornitorrinco debe resolver el misterio del hielo mágico.',
    tags:['ornitorrinco','invierno','misterio','río'], duration:'10:00' },
]

export const MONTHS = [
  { label: 'Septiembre 2026', videoIds: [1,2,3,4,5,6,7,8,9] as const },
  { label: 'Octubre 2026',    videoIds: [10,11,12,13,14,15,16,17,18] as const },
  { label: 'Noviembre 2026',  videoIds: [19,20,21,22,23,24] as const },
]
