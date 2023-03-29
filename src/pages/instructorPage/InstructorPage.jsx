import React, { useEffect, useRef, useState } from 'react';
import CompShowShedule from '../managementShedule/CompShowShedule';
import ComponentResume from '../managementShedule/ComponentResume';
import { GetInstructor } from '../../graphQL/instructor/queryInstructor';
import { useMutation, useQuery } from "@apollo/client";
import { REFRESH_TOKEN } from '../../graphQL/auth/mutationsAuth';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './css/styleInstructor.css';
import Footer from '../../components/footer/Footer';

function InstructorPage({ userData }) {

  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [user, setUser] = useState({});
  const [sheduleInst, setSheduleInst] = useState({});
  const [selectShedule, setSelectShedule] = useState(0);
  const [titleTable, setTitleTable] = useState('');
  const { error, loading, data } = useQuery(GetInstructor, {  
    variables: { instructor: userData._id } });  
  const [refreshToken, resultRefresh] = useMutation(REFRESH_TOKEN);  
  const bodyTable = useRef();
  
  useEffect(() => { refreshToken(); }, [refreshToken]);
  useEffect(() => {
    if (resultRefresh.data) {
      if (resultRefresh.data.refreshToken.token) {
        setToken(resultRefresh.data.refreshToken.token);
        clearTable();
      } 
      if (resultRefresh.data.refreshToken.error) {
        setToken(null);
        Swal.fire('Error!!!', `Lo Sentimos pero Usted, No ha Iniciado Sesion`, 'error');
        navigate('/');
      } 
    } 
  }, [resultRefresh.data, resultRefresh.error]);

  useEffect(() => {
    if (data) {
      setUser(data.getOneShedule.Instructor);
      setSheduleInst(data.getOneShedule);
      setSelectShedule(data.getOneShedule.Horario.length - 1);
    }
    if (error) {
      if (userData.Rol !== 'INSTRUCTOR') 
        Swal.fire('Error!', `Lo Sentimos, pero Usted No esta Autorizado para Acceder a esta Pagina`, 'error');
      else Swal.fire('Atencion!', `Usted, Aun No tiene Horarios Asignados, Comuniquese con el Administrador`, 'info');
      navigate('/greeting')
    } 
  }, [data, error]);
  
  const clearTable = () => {
    setTimeout(() => {
      let pos = 0;
      if (bodyTable?.current) {
        bodyTable.current.innerHTML = '';
        for (let i = 0; i < 16; i++) {
          bodyTable.current.innerHTML += `
            <tr>
              <th scope="row">${(i + 6 < 10) ? 0 : ''}${i + 6}:00 - ${(i + 7 < 10) ? 0 : ''}${i + 7}:00</th>
              <td id="${pos++}" class="color_none"></td>
              <td id="${pos++}" class="color_none"></td>
              <td id="${pos++}" class="color_none"></td>
              <td id="${pos++}" class="color_none"></td>
              <td id="${pos++}" class="color_none"></td>
              <td id="${pos++}" class="color_none"></td>
              <td id="${pos++}" class="color_none"></td>
            </tr>
          `;
        }
      }
    }, 10);
  }  
  if (loading || resultRefresh.loading) return <h1>Loading . . .</h1>;

  return (
    <>
      <section className="inst_container">
        <section className="info_instructor">
          <h1 id="name_instructor">{`${user.Nombre} ${user.Apellido}`}</h1>
          <span>Instructor SENA</span>
        </section>

        <section className="show_shedule instructor_page">
          <section className='show_cards'>
            {
              sheduleInst?.Horario && <CompShowShedule userSelected={sheduleInst} sizeShed={selectShedule}
                setSizeShed={setSelectShedule} setTableTitle={setTitleTable} clearTable={clearTable} />
            }
          </section>
          <section className="resume_Show">
            { sheduleInst?.Horario && <ComponentResume user={sheduleInst} sizeShed={selectShedule} /> }
          </section>
        </section>

        <section className="table_shedule">
          <h2 className="cantHoras">{ titleTable }</h2>
          <section className="resume"></section>
          <section className="show_table">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="th_hour">Hora</th>
                  <th>Lunes</th>
                  <th>Martes</th>
                  <th>Miercoles</th>
                  <th>Jueves</th>
                  <th>Viernes</th>
                  <th>Sabado</th>
                  <th>Domingo</th>
                </tr>
              </thead>
              <tbody id="table_body" ref={bodyTable}></tbody>
            </table>
          </section>
        </section>
        <br /><br />
      </section>
      <section className="section_instructor"><Footer /></section>
    </>
  )
}

export default React.memo(InstructorPage)