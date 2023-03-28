import React, { useEffect } from 'react';
import logoSANF2 from '../../assets/logoSANF2.png';
import { REFRESH_TOKEN } from '../../graphQL/auth/mutationsAuth';
import { useAuth } from '../../context/authContext';
import { useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const GreetingPage = () => {

  const navigate = useNavigate();
  const { setToken } = useAuth(); 
  const [refreshToken, resultRefresh] = useMutation(REFRESH_TOKEN);  

  useEffect(() => { refreshToken(); }, [refreshToken]);
  useEffect(() => {
    if (resultRefresh.data) {
      if (resultRefresh.data.refreshToken.token) {
        setToken(resultRefresh.data.refreshToken.token);
      } 
      if (resultRefresh.data.refreshToken.error) {
        setToken(null);
        Swal.fire('Error!!!', `Lo Sentimos pero Usted, No ha Iniciado Sesion`, 'error');
        navigate('/');
      } 
    } 
  }, [resultRefresh.data, resultRefresh.error]);

  return (
    <div className="welcomePage" style={{ marginLeft: '88px', width: 'calc(100vw - 88px)' }}>
      <section className="background">
        <section className="welcomeContent" id="sectionWelcome" >
          <div className="divHead">
            <img src={ logoSANF2 } alt="Logo-SENA-SANF" className="logoWelcome" /> SENA - SANF
          </div>
          <div className="divMain">
            <h1>HOLA Y BIENVENIDO</h1>
            <p>
              Desde el grupo <b>SENA-SANF</b> le damos una calurosa bienvenida a nuestra aplicacion web
              en donde podra de una manera eficaz, ordenada y sensilla, organizar, ver, editar y administrar
              el manejo de horarios. <br /><br /> Esta aplicacion va dirigida a Instructores, Funcionarios y Administradores
              <b> SENA</b> del Centro de Materiales y Ensayos del Complejo Sur situado en la ciudad de Bogotá D.C.
            </p>
          </div>
        </section>
      </section>
    </div>
  )
}
