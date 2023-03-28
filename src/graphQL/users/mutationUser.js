import { gql } from '@apollo/client';

export const UpdateUser = gql`
    mutation UpdateUser(
        $id: ID!, 
        $active: Boolean!
    ) {
        updateUser(
            _id: $id, 
            Active: $active
        ) {
            _id
            Active
        }
    }
`;

export const CreateUser = gql`
    mutation CreateUser (
        $nombre: String!, 
        $apellido: String!, 
        $tipoDocumento: Enum_Type_Doc!, 
        $numDocumento: String!, 
        $email: String!, 
        $password: String!, 
        $rol: Enum_Rol!
    ) {
        createUser(
            Nombre: $nombre, 
            Apellido: $apellido, 
            Tipo_Documento: $tipoDocumento, 
            Num_Documento: $numDocumento, 
            Email: $email, 
            Password: $password, 
            Rol: $rol
        ) {
            Nombre
            Apellido
            _id
        }
    }
`;

export const UPDATE_DATA_USER = gql`
    mutation updateDataUser(
        $id: ID!
        $tipoDocumento: Enum_Type_Doc
        $numDocumento: String
        $email: String
        $password: String
    ) {
        updateUser(
            _id: $id
            Tipo_Documento: $tipoDocumento
            Num_Documento: $numDocumento
            Email: $email
            Password: $password
        ) {
            _id
            Tipo_Documento
            Num_Documento
            Email
            Password
        }
    }
`;