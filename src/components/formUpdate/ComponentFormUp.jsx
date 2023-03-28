import { useMutation } from '@apollo/client';
import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import Swal from 'sweetalert2';
import { UPDATE_DATA_USER } from '../../graphQL/users/mutationUser';
import { confirmChanges } from '../../pages/managementShedule/CompUpdateFicha';

const validateFields = {};
export const ComponentFormUp = ({ userData }) => {

  const [updateData, resUpdate] = useMutation(UPDATE_DATA_USER);
  const formElm = useRef();
  const passInput = useRef();

  useEffect(() => {
    if (resUpdate.error) Swal.fire('Error!', `${resUpdate.error.message}`, 'error');
    if (resUpdate.data) {
      Swal.fire('Información Actualizada!', `Los Datos han sido modificados exitosamente`, 'success');
      closeModal();
    }
  }, [resUpdate.error, resUpdate.data]);

  const expresiones = {
    numDocumento: /^([a-zA-Z]{4}|[0-9]){8,12}$/,
    email: /^\w+@(misena|soy\.sena)\.edu\.co$/,
    passNew: /^.{8,20}$/
  }
  const closeModal = () => {
    document.querySelector('.modal').classList.remove('modal_show');
    document.querySelectorAll('.form_incorrect').forEach(e => e.classList.remove('form_incorrect'));
    document.querySelectorAll('.message_error').forEach(e => e.style.display = 'none');
    passInput.current.removeAttribute('required');
    formElm.current.reset();
  }
  const handleInput = e => {
    let name = e.target.id;
    let valor = e.target.value;

    const options = {
      tipoDocumento: () => validateFields['tipoDocumento'] = valor,
      numDocumento: () => validarData('numDocumento', valor),
      email: () => validarData('email', valor),
      passNew: () => {
        validarData('passNew', valor);
        confirmPassword();
        if (e.target.value.length) passInput.current.setAttribute('required', true);
        else passInput.current.removeAttribute('required');
      },
      confirmPass: () => confirmPassword()
    }
    if (options[name]) { options[name](); }
  };
  const validarData = (name, valor) => {
    if (expresiones[name].test(valor)) {
      applyChanges(name, true);
      if (name !== 'passNew') validateFields[name] = valor;
    } else {
      applyChanges(name, false);
      delete validateFields[name];
    }
  }
  const applyChanges = (name, bool) => {
    if (bool) {
      document.getElementById(`group_${name}`).classList.remove('form_incorrect');
      document.querySelector(`#group_${name} p`).style.display = 'none';
    } else {
      document.getElementById(`group_${name}`).classList.add('form_incorrect');
      document.querySelector(`#group_${name} p`).style.display = 'block';
    }
  }
  const confirmPassword = () => {
    let pass = document.getElementById('passNew').value;
    let pass2 = document.getElementById('confirmPass').value;

    if (pass && pass2) {
      if (pass === pass2) {
        applyChanges('confirmPass', true);
        validateFields['password'] = pass2;
      } else {
        applyChanges('confirmPass', false);
        delete validateFields['password'];
      }
    }
  }
  const submitForm = async e => {
    e.preventDefault();
    if (await confirmChanges('Modificar esta Información', 'Actualizar')) {
      updateData({ variables: { id: userData._id, ...validateFields } });
    }
    console.log({ id: userData._id, ...validateFields });
  };

  return (
    <section className="modal">
      <div className="contain_modal">
        <article className="head_modal">
          <div className="modal_title">
            <i className="bi bi-person-fill-gear"></i>
            <h2>Actualización de Datos Personales</h2>
          </div>
          <button className="modal_close" onClick={closeModal}>
            <i className="bi bi-x-lg"></i>
          </button>
        </article>
        <article className="bodyForm">
          {resUpdate.loading && resUpdate.called ? <h2>Loading ...</h2> : (
            <form className='form_update_data' ref={formElm} onInput={handleInput} onSubmit={submitForm}>
              <section>
                <label htmlFor="tipoDocumento" className='form_up_label'>Tipo de Documento :</label>
                <section className='form_section_up'>
                  <i className="bi bi-person-vcard-fill iconsLogin"></i>
                  <select defaultValue={''} id="tipoDocumento">
                    <option value="" disabled>Seleccionar . . .</option>
                    <option value="CEDULA_DE_CIUDADANIA">Cédula de Ciudadania</option>
                    <option value="TARJETA_DE_IDENTIDAD">Tarjeta de Identidad</option>
                    <option value="CEDULA_DE_EXTRANJERIA">Cédula de Extranjeria</option>
                    <option value="PEP">PEP</option>
                    <option value="PERMISO_DE_PROTECCION_TEMPORAL">Permiso Protección Temporal</option>
                  </select>
                </section>
              </section>

              <section id="group_numDocumento">
                <label htmlFor="numDocumento" className='form_up_label'>Número de Documento :</label>
                <section className='form_section_up'>
                  <i className="bi bi-person-circle iconsLogin"></i>
                  <input type="text" id="numDocumento" autoComplete="off" placeholder="1234567890" />
                </section>
                <p className="message_error">
                  No puede contener espacios ni caracteres especiales y debe contener minimo 8 caracteres
                </p>
              </section>

              <section className='section_big' id="group_email">
                <label htmlFor="email" className='form_up_label'>Correo Electronico :</label>
                <section className='form_section_up'>
                  <i className="bi bi-envelope-at-fill iconsLogin"></i>
                  <input type="email" id="email" autoComplete="off" placeholder="correo@soy.sena.edu.co" />
                </section>
                <p className="message_error">
                  El Correo debe ser de dominio sena (misena o soy.sena)
                </p>
              </section>

              <section id="group_passNew">
                <label htmlFor="passNew" className='form_up_label'>Contraseña :</label>
                <section className='form_section_up'>
                  <i className="bi bi-shield-lock-fill iconsLogin"></i>
                  <input type="password" id="passNew" autoComplete="off" placeholder="Ingrese Su Nueva Contraseña" />
                </section>
                <p className="message_error">La Contraseña debe tener minimo 8 caracteres</p>
              </section>

              <section id="group_confirmPass">
                <label htmlFor="confirmPass" className='form_up_label'>Confirmar Contraseña :</label>
                <section className='form_section_up'>
                  <i className="bi bi-lock-fill iconsLogin"></i>
                  <input type="password" id="confirmPass" autoComplete="off" placeholder="Confirme Contraseña Nueva" ref={passInput} />
                  <p className="message_error">La contraseña No coincide, verifiquela</p>
                </section>
              </section>

              <section className='section_big section_btns_up'>
                <button type='button' onClick={closeModal}>Cancelar</button>
                <button type='reset'>Limpiar</button>
                <button type='submit'>Guardar</button>
              </section>
            </form>
          )}

        </article>
      </div>
    </section>
  )
}
