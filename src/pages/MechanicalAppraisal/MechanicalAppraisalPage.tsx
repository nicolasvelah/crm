/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import Menu from '../../components/Template';
import MechanicalAppraisalList from './MechanicalAppraisalList';

const MechanicalAppraisal = () => {
  return (
    <Menu page="MechanicalAppraisalPage">
      <MechanicalAppraisalList />
    </Menu>
  );
};

export default MechanicalAppraisal;
