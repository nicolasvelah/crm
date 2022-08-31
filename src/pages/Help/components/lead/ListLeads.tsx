import React from 'react';
import RowHelp from '../RowHelp';
import HeaderHelp from '../HeaderHelp';

const ListLeads = () => {
  return (
    <>
      <HeaderHelp
        title="Lista de Negocios"
        pathImage="/img/help-page/lead/lead-list/lead-list/img_help_leads_list_ok.png"
      />

      <RowHelp
        numberItem="I"
        description="Campo donde se puede buscar un negocio por su ID, o por nombre,
        apellido o identificación del cliente."
        pathImage="/img/help-page/lead/lead-list/lead-list/search.png"
      />

      <RowHelp
        numberItem="II"
        description="Selector de fecha inicial y fecha final para buscar un negocio en
        ese periodo de tiempo."
        pathImage="/img/help-page/lead/lead-list/lead-list/range.png"
      />

      <RowHelp
        numberItem="III"
        description="Botón que nos permite subir negocios por medio de un excel."
        pathImage="/img/help-page/lead/lead-list/lead-list/subir_negocios.png"
      />

      <RowHelp
        numberItem="IV"
        description="Botón que nos permite descargar un excel con los negocios actuales."
        pathImage="/img/help-page/lead/lead-list/lead-list/bajar_negocios.png"
      />

      <RowHelp
        numberItem="V"
        description="Botón que nos permite crear un negocio."
        pathImage="/img/help-page/lead/lead-list/lead-list/crear_negocio.png"
      />

      <RowHelp
        numberItem="VI"
        description=" Lista de negocios. Se puede filtrar la lista por medio de sus
        columnas."
        pathImage="/img/help-page/lead/lead-list/lead-list/lista_negocios.png"
        width="100%"
      />

      <RowHelp
        numberItem="VII"
        description=" Botón que nos direcciona a la página de negocio seleccionado dentro
        del GUC."
        pathImage="/img/help-page/lead/lead-list/lead-list/ver_negocio.png"
      />

      <RowHelp
        numberItem="VIII"
        description="Paginación de la lista de negocios."
        pathImage="/img/help-page/lead/lead-list/lead-list/paginas_negocios.png"
      />
    </>
  );
};

export default ListLeads;
