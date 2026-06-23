import React, {useContext} from 'react';
import {AppContext} from '../context/AppContext';
import {ScoopCard} from '../components/ScoopCard';
import {Sparkles, Gift, ShieldCheck, Heart, MapPin, Clock, MessageCircle, Instagram, Video} from 'lucide-react';

import anumiImage from '../assets/sinfondo.png';
import moonbloomImage from '../assets/moonbloom.png';
import mistyImage from '../assets/misty.jpeg';
import stardustImage from '../assets/stardust.jpeg';

export const Home = () =>{
    const {setSelectedScoop, navigate } = useContext(AppContext);

    const scoopsData = [
    {
        id: 'misty',
        name: 'Misty Scoop',
        price: 360,
        minProducts: 1,
        maxProducts: 7,
        image: mistyImage,
        description: 'Nuestra opción compacta e ideal para un lindo detalle sorpresa. ¡Llena tu día de ternura con accesorios prácticos!'
    },
    {
        id: 'moonbloom',
        name: 'Moonbloom Scoop',
        price: 580,
        minProducts: 1,
        maxProducts: 10,
        image: moonbloomImage,
        description:'Un scoop equilibrado y mágico con una excelente variedad de tus accesorios Sanrio favoritos.'
    },
    {
        id: 'stardust',
        name: 'Stardust Scoop',
        price: 1400,
        minProducts: 1,
        maxProducts: 15,
        image: stardustImage,
        description:  'La experiencia scoop definitiva. Un balde gigante lleno de peluches medianos/grandes, papelería premium, bolsos y sorpresas exclusivas.'
    }
   ];

   const handleStartCustomizing =() => {
    setSelectedScoop(scoopsData[1]);
    navigate('customize');
   }



}