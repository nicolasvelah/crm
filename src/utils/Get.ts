/* eslint-disable max-classes-per-file */
class DependncyInjection {
  vars: Map<string, any> = new Map();

  put(
    t: any,
    {
      name,
      override = false,
    }: {
      name: string;
      override?: boolean;
    }
  ): void {
    if (!override && this.vars.has(name)) {
      throw new Error(
        `Get:: duplicated dependency (${name}), use override to update the value`
      );
    }
    this.vars.set(name, t);
  }

  find<T>(name: string): T {
    return this.vars.get(name);
  }

  delete(name: string): void {
    this.vars.delete(name);
  }
}

const Get = new DependncyInjection();

export default Get;
