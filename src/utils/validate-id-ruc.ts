/* eslint-disable radix */
export type TypeDocument = 'CEDULA' | 'RUC' | 'PASAPORTE';

export interface RespValidate {
  isValidate: boolean;
  message: string;
  isClient?: boolean;
}

const validateIdRuc: (type: TypeDocument, id: string) => RespValidate = (
  type: TypeDocument,
  identification: string
): RespValidate => {
  //const identification = '0931811087';
  if (type === 'CEDULA' && identification.length === 10) {
    //Obtenemos el digito de la region que sonlos dos primeros digitos
    // eslint-disable-next-line radix
    const digitoRegion = parseInt(identification.substring(0, 2));

    //Pregunto si la region existe ecuador se divide en 24 regiones
    if (digitoRegion >= 1 && digitoRegion <= 24) {
      // Extraigo el ultimo digito
      const ultimoDigito = parseInt(identification.substring(9, 10));

      //Agrupo todos los pares y los sumo
      const pares =
        // eslint-disable-next-line radix
        parseInt(identification.substring(1, 2)) +
        parseInt(identification.substring(3, 4)) +
        parseInt(identification.substring(5, 6)) +
        parseInt(identification.substring(7, 8));

      //Agrupo los impares, los multiplico por un factor de 2,
      // si la resultante es > que 9 le restamos el 9 a la resultante
      let numero1 = parseInt(identification.substring(0, 1));
      numero1 *= 2;
      if (numero1 > 9) {
        numero1 -= 9;
      }

      let numero3 = parseInt(identification.substring(2, 3));
      numero3 *= 2;
      if (numero3 > 9) {
        numero3 -= 9;
      }

      let numero5 = parseInt(identification.substring(4, 5));
      numero5 *= 2;
      if (numero5 > 9) {
        numero5 -= 9;
      }

      let numero7 = parseInt(identification.substring(6, 7));
      numero7 *= 2;
      if (numero7 > 9) {
        numero7 -= 9;
      }

      let numero9 = parseInt(identification.substring(8, 9));
      numero9 *= 2;
      if (numero9 > 9) {
        numero9 -= 9;
      }

      const impares = numero1 + numero3 + numero5 + numero7 + numero9;

      //Suma total
      const sumaTotal = pares + impares;

      //extraemos el primero digito
      const primerDigitoSuma = String(sumaTotal).substring(0, 1);

      //Obtenemos la decena inmediata
      const decena = (parseInt(primerDigitoSuma) + 1) * 10;

      //Obtenemos la resta de la decena inmediata - la sumaTotal esto nos da el digito validador
      let digitoValidador = decena - sumaTotal;

      //Si el digito validador es = a 10 toma el valor de 0
      if (digitoValidador === 10) digitoValidador = 0;

      //Validamos que el digito validador sea igual al de la identification
      if (digitoValidador === ultimoDigito) {
        ////console.log('la identification:' + identification + ' es correcta');
        return {
          isValidate: true,
          message: 'ok',
        };
      }

      return {
        isValidate: false,
        message: 'Identificación incorrecta',
      };
    }
    // imprimimos en consola si la region no pertenece

    return {
      isValidate: false,
      message: 'Esta identification no pertenece a ninguna region',
    };
  }
  if (
    type === 'CEDULA' &&
    (identification.length > 10 || identification.length < 10)
  ) {
    return {
      isValidate: false,
      message: 'Esta identification no tiene 10 Digitos',
    };
  }
  //imprimimos en consola si la identification tiene mas o menos de 10 digitos

  if (type === 'RUC' && identification.length === 13) {
    //Obtenemos el digito de la region que sonlos dos primeros digitos
    // eslint-disable-next-line radix
    const digitoRegion = parseInt(identification.substring(0, 2));

    //Pregunto si la region existe ecuador se divide en 24 regiones
    if (digitoRegion >= 1 && digitoRegion <= 24) {
      // Extraigo el ultimo digito
      const ultimoDigito = parseInt(identification.substring(9, 10));

      //Agrupo todos los pares y los sumo
      const pares =
        // eslint-disable-next-line radix
        parseInt(identification.substring(1, 2)) +
        parseInt(identification.substring(3, 4)) +
        parseInt(identification.substring(5, 6)) +
        parseInt(identification.substring(7, 8));

      //Agrupo los impares, los multiplico por un factor de 2,
      // si la resultante es > que 9 le restamos el 9 a la resultante
      let numero1 = parseInt(identification.substring(0, 1));
      numero1 *= 2;
      if (numero1 > 9) {
        numero1 -= 9;
      }

      let numero3 = parseInt(identification.substring(2, 3));
      numero3 *= 2;
      if (numero3 > 9) {
        numero3 -= 9;
      }

      let numero5 = parseInt(identification.substring(4, 5));
      numero5 *= 2;
      if (numero5 > 9) {
        numero5 -= 9;
      }

      let numero7 = parseInt(identification.substring(6, 7));
      numero7 *= 2;
      if (numero7 > 9) {
        numero7 -= 9;
      }

      let numero9 = parseInt(identification.substring(8, 9));
      numero9 *= 2;
      if (numero9 > 9) {
        numero9 -= 9;
      }

      const impares = numero1 + numero3 + numero5 + numero7 + numero9;

      //Suma total
      const sumaTotal = pares + impares;

      //extraemos el primero digito
      const primerDigitoSuma = String(sumaTotal).substring(0, 1);

      //Obtenemos la decena inmediata
      const decena = (parseInt(primerDigitoSuma) + 1) * 10;

      //Obtenemos la resta de la decena inmediata - la sumaTotal esto nos da el digito validador
      let digitoValidador = decena - sumaTotal;

      //Si el digito validador es = a 10 toma el valor de 0
      if (digitoValidador === 10) digitoValidador = 0;

      //Validamos que el digito validador sea igual al de la identification
      if (digitoValidador === ultimoDigito) {
        ////console.log('la identification:' + identification + ' es correcta');
        const lastCharacters = identification.substr(identification.length - 3);
        //console.log('lastCharacters', lastCharacters);
        if (lastCharacters === '001') {
          return {
            isValidate: true,
            message: 'ok',
          };
        }
        return {
          isValidate: false,
          message: 'La identificación no es correcta',
        };
      }

      return {
        isValidate: false,
        message: 'Identificación incorrecta',
      };
    }
    // imprimimos en consola si la region no pertenece

    return {
      isValidate: false,
      message: 'Esta identification no pertenece a ninguna region',
    };
  }

  if (
    type === 'RUC' &&
    (identification.length > 13 || identification.length < 13)
  ) {
    return {
      isValidate: false,
      message: 'Esta identification no tiene 13 Digitos',
    };
  }

  if (type === 'PASAPORTE') {
    return {
      isValidate: true,
      message: 'ok',
    };
  }
  return {
    isValidate: false,
    message: 'Tipo de identificación no válida',
  };
};

export default validateIdRuc;
