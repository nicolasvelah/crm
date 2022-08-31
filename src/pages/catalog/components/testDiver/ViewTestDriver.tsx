import React, { FunctionComponent, useContext } from 'react';
import { Divider, Col, Tag, Row, Card } from 'antd';
import moment from 'moment';
import { CarOutlined } from '@ant-design/icons';
import { CatalogContext } from '../../../../state/CatalogueState';
import milisecondsToDate from '../../../../utils/milisecondsToDate';

const { Meta } = Card;

const ViewTestDriver: FunctionComponent<{ dataTestDriver: any[] }> = ({
  dataTestDriver,
}) => {
  const { setDataTestDriverSelection, setViewTestDriver } = useContext(
    CatalogContext
  );
  //console.log('dataTestDriver', dataTestDriver);
  return (
    <div className="mb-10">
      {dataTestDriver.length > 0 && (
        <Divider orientation="left">Mis Test Drives</Divider>
      )}
      <Row gutter={[10, 10]} className="mt-2">
        {dataTestDriver.length > 0 &&
          dataTestDriver.map((data: any, index: any) => (
            <Col md={6} lg={6} xl={6} key={index}>
              <Card
                hoverable
                onClick={() => {
                  setDataTestDriverSelection(dataTestDriver[index]);
                  setViewTestDriver('testDriver');
                }}
                actions={[
                  data.dateTestConfirmation ? (
                    <Tag color="green">Concluido</Tag>
                  ) : (
                    <Tag color="orange">Pendiente</Tag>
                  ),
                ]}
              >
                <Divider orientation="left" style={{ marginTop: 0 }}>
                  Test Drive
                </Divider>
                <Meta
                  title={
                    <div>
                      <CarOutlined /> {data.brandVehicle} {data.modelVehicle}
                    </div>
                  }
                  description={
                    <div>
                      <ul style={{ marginLeft: 0, paddingLeft: 0 }}>
                        <li>
                          Fecha:{' '}
                          {moment(Number(data.dateTestDriver)).format(
                            'DD-MM-YYYY HH:mm'
                          )}
                        </li>
                        {data.dateTestConfirmation ? (
                          <li>
                            Cerrado:{' '}
                            {milisecondsToDate(
                              data.dateTestConfirmation,
                              'DD-MM-YYYY HH:mm'
                            )}
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default ViewTestDriver;
