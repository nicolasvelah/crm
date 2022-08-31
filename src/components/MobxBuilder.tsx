import { intercept, IValueWillChange } from 'mobx';
import { observer } from 'mobx-react';
/* eslint-disable react/destructuring-assignment */
import React from 'react';

@observer
export class MobxBuilder<T> extends React.PureComponent<{
  observable: any;
  id: string;
  condition?: (nextValue: IValueWillChange<T>) => IValueWillChange<T> | null;
}> {
  componentDidMount() {
    const { observable, id, condition } = this.props;
    intercept(observable, id, (change) => {
      if (condition) {
        return condition(change);
      }
      return change;
    });
  }

  render() {
    //console.log('🎃');
    return this.props.children;
  }
}
