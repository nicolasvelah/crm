import React from 'react';
import RowHelp from '../RowHelp';
import HeaderHelp from '../HeaderHelp';

const pathCreateLead = '/img/help-page/lead/lead-list/create-lead';

const CreateLead = () => {
  return (
    <>
      <HeaderHelp
        title="Crear Negocio"
        pathImage={`${pathCreateLead}/create_lead.png`}
      />

      <RowHelp
        numberItem="I"
        description="Seleccionador de concesionario y sucural para usuarios."
        pathImage={`${pathCreateLead}/select_sucursal.png`}
      />

      <RowHelp
        numberItem="II"
        description="Detalles del usuario seleccionado para crear el negocio."
        pathImage={`${pathCreateLead}/card_user.png`}
      />

      <RowHelp
        numberItem="III"
        description="Campo que nos permite buscar el usuario por medio de su nombre y apellido."
        pathImage={`${pathCreateLead}/search_user.png`}
      />

      <RowHelp
        numberItem="IV"
        description="Lista de usuarios a seleecionar para la creación del negocio."
        pathImage={`${pathCreateLead}/list_user.png`}
        width="100%"
      />

      <RowHelp
        numberItem="V"
        description="Detalles del cliente seleccionado para crear el negocio."
        pathImage={`${pathCreateLead}/card_client.png`}
      />

      <RowHelp
        numberItem="VI"
        description="Campo que nos permite buscar el cliente por medio de su identificación."
        pathImage={`${pathCreateLead}/search_client.png`}
        
      />

      <RowHelp
        numberItem="VII"
        description="Lista de clientes a seleecionar para la creación del negocio."
        pathImage={`${pathCreateLead}/list_client.png`}
        width="100%"
      />

      <RowHelp
        numberItem="VIII"
        description="Campo que nos permite seleccionar la campaña del negocio."
        pathImage={`${pathCreateLead}/campaing.png`}
      />

      <RowHelp
        numberItem="IX"
        description="Botón que creará el negocio una vez seleccionado un usuario y un cliente."
        pathImage={`${pathCreateLead}/create.png`}
      />
    </>
  );
};

export default CreateLead;
