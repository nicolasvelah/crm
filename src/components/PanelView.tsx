/* eslint-disable react/require-default-props */
import { Badge, Popover, Tag } from 'antd';
import React from 'react';
import '../styles/sass/pages/lead/panel-view.scss';

interface Props {
  title?: string;
  customHeader?: React.ReactNode;
  status?: { value: string; color: string; popover: string | null };
  children: React.ReactNode;
}

const PanelView = (props: Props) => {
  const { title, status, children, customHeader } = props;

  const tag = status ? (
    <Tag className="ml-2 mr-0" color={status.color}>
      {status.value}
    </Tag>
  ) : null;

  return (
    <div className="panel-view">
      {customHeader && <div className="panel-header">{customHeader}</div>}
      {!customHeader && status && (
        <div className="panel-header flex items-center justify-between">
          <h2 className="text-lg font-bold m-0">{title}</h2>
          <div className="flex items-center ">
            <span className="font-bold">Estado</span>

            {status.popover !== null && (
              <Popover
                placement="topRight"
                content={<div style={{ maxWidth: 400 }}>{status.popover}</div>}
              >
                <Badge dot color="blue">
                  {tag}
                </Badge>
              </Popover>
            )}

            {status.popover === null && tag}
          </div>
        </div>
      )}
      <div className="panel-content">{children}</div>
    </div>
  );
};

export default PanelView;
