import React from 'react';
import Layout from '../components/Layout';
import '../assets/styles/formulario_inicio.css'
import Contacto from '../components/Contacto';

const ContactoPage: React.FC = () => {
    return (
        <Layout>
            <Contacto />
        </Layout>
    );
}

export default ContactoPage;