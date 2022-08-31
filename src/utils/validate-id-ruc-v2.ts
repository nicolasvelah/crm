/* eslint-disable no-restricted-globals */

class ValidarIdentificacion {
  /**
   * Error
   *
   * Contiene errores globales de la clase
   *
   * @var string
   * @access private
   */
  private error = '';

  /**
   * Validar cédula
   *
   * @param  string  numero  Número de cédula
   *
   * @return Boolean
   */
  public validarCedula(numero: string) {
    // fuerzo parametro de entrada a string

    // borro por si acaso errores de llamadas anteriores.

    // validaciones
    try {
      this.validarInicial(numero, 10);
      this.validarCodigoProvincia(numero.substr(0, 2));
      this.validarTercerDigito(numero[2], 'cedula');
      this.algoritmoModulo10(numero.substr(0, 9), numero[9]);
    } catch (error) {
      //console.log('Error validarCedula', error.message);
      return {
        isValidate: false,
        message: error.message,
      };
    }

    return {
      isValidate: true,
      message: 'ok',
    };
  }

  /**
   * Validar RUC persona natural
   *
   * @param  string  numero  Número de RUC persona natural
   *
   * @return Boolean
   */
  public validarRucPersonaNatural(numero: string) {
    // borro por si acaso errores de llamadas anteriores.

    // validaciones
    try {
      this.validarInicial(numero, 13);
      this.validarCodigoProvincia(numero.substr(0, 2));
      this.validarTercerDigito(numero[2], 'ruc_natural');
      this.validarCodigoEstablecimiento(numero.substr(10, 3));
      this.algoritmoModulo10(numero.substr(0, 9), numero[9]);
    } catch (e) {
      //console.log('Error validarRucPersonaNatural', e.message);
      return {
        isValidate: false,
        message: e.message,
      };
    }

    return {
      isValidate: true,
      message: 'ok',
    };
  }

  /**
   * Validar RUC sociedad privada
   *
   * @param  string  numero  Número de RUC sociedad privada
   *
   * @return Boolean
   */
  public validarRucSociedadPrivada(numero: string) {
    // borro por si acaso errores de llamadas anteriores.
    this.setError('');

    // validaciones
    try {
      this.validarInicial(numero, 13);
      this.validarCodigoProvincia(numero.substr(0, 2));
      this.validarTercerDigito(numero[2], 'ruc_privada');
      this.validarCodigoEstablecimiento(numero.substr(10, 3));
      this.algoritmoModulo11(numero.substr(0, 9), numero[9], 'ruc_privada');
    } catch (e) {
      this.setError(e.message);
      //console.log('Error validarRucSociedadPrivada', e.message);
      return {
        isValidate: false,
        message: e.message,
      };
    }

    return {
      isValidate: true,
      message: 'ok',
    };
  }

  /**
   * Validar RUC sociedad publica
   *
   * @param  string  numero  Número de RUC sociedad publica
   *
   * @return Boolean
   */
  public validarRucSociedadPublica(numero: string) {
    // borro por si acaso errores de llamadas anteriores.

    // validaciones
    try {
      this.validarInicial(numero, 13);
      this.validarCodigoProvincia(numero.substr(0, 2));
      this.validarTercerDigito(numero[2], 'ruc_publica');
      this.validarCodigoEstablecimiento(numero.substr(9, 4));
      this.algoritmoModulo11(numero.substr(0, 8), numero[8], 'ruc_publica');
    } catch (e) {
      //console.log('Error validarRucSociedadPublica', e.message);
      return {
        isValidate: false,
        message: e.message,
      };
    }

    return {
      isValidate: true,
      message: 'ok',
    };
  }

  /**
   * Validaciones iniciales para CI y RUC
   *
   * @param  string  numero      CI o RUC
   * @param  integer $caracteres  Cantidad de caracteres requeridos
   *
   * @return Boolean
   *
   * @throws exception Cuando valor esta vacio, cuando no es dígito y
   * cuando no tiene cantidad requerida de caracteres
   */
  private validarInicial = (numero: string, caracteres: number) => {
    const regex = /^[0-9]*$/;
    const onlyNumbers = regex.test(numero);
    if (numero === '') {
      throw new Error('Valor no puede estar vacio');
    }

    if (!onlyNumbers) {
      throw new Error('Valor ingresado solo puede tener dígitos');
    }

    if (numero.length !== caracteres) {
      throw new Error(`Valor ingresado debe tener ${caracteres} caracteres`);
    }

    return true;
  };

  /**
   * Validación de código de provincia (dos primeros dígitos de CI/RUC)
   *
   * @param  string  numero  Dos primeros dígitos de CI/RUC
   *
   * @return boolean
   *
   * @throws exception Cuando el código de provincia no esta entre 00 y 24
   */
  private validarCodigoProvincia = (numeroInit: string) => {
    const numero = parseInt(numeroInit);
    if (numero < 0 || numero > 24) {
      throw new Error(
        'Codigo de Provincia (dos primeros dígitos) no deben ser mayor a 24 ni menores a 0'
      );
    }

    return true;
  };

  /**
   * Validación de tercer dígito
   *
   * Permite validad el tercer dígito del documento. Dependiendo
   * del campo tipo (tipo de identificación) se realizan las validaciones.
   * Los posibles valores del campo tipo son: cedula, ruc_natural, ruc_privada
   *
   * Para Cédulas y RUC de personas naturales el terder dígito debe
   * estar entre 0 y 5 (0,1,2,3,4,5)
   *
   * Para RUC de sociedades privadas el terder dígito debe ser
   * igual a 9.
   *
   * Para RUC de sociedades públicas el terder dígito debe ser
   * igual a 6.
   *
   * @param  string numero  tercer dígito de CI/RUC
   * @param  string $tipo  tipo de identificador
   *
   * @return boolean
   *
   * @throws exception Cuando el tercer digito no es válido. El mensaje
   * de error depende del tipo de Idenficiación.
   */
  validarTercerDigito = (numeroInit: string, tipo: string) => {
    const numero = parseInt(numeroInit);
    switch (tipo) {
      case 'cedula':
      case 'ruc_natural':
        if (numero < 0 || numero > 5) {
          throw new Error(
            'Tercer dígito debe ser mayor o igual a 0 y menor a 6 para cédulas y RUC de persona natural'
          );
        }
        break;
      case 'ruc_privada':
        if (numero !== 9) {
          throw new Error(
            'Tercer dígito debe ser igual a 9 para sociedades privadas'
          );
        }
        break;

      case 'ruc_publica':
        if (numero !== 6) {
          throw new Error(
            'Tercer dígito debe ser igual a 6 para sociedades públicas'
          );
        }
        break;
      default:
        throw new Error('Tipo de Identificación no existe.');
    }

    return true;
  };

  /**
   * Validación de código de establecimiento
   *
   * @param  string numero  tercer dígito de CI/RUC
   *
   * @return boolean
   *
   * @throws exception Cuando el establecimiento es menor a 1
   */
  private validarCodigoEstablecimiento = (numeroInit: string) => {
    const numero = parseInt(numeroInit);
    if (numero < 1) {
      throw new Error('Código de establecimiento no puede ser 0');
    }

    return true;
  };

  /**
   * Algoritmo Modulo10 para validar si CI y RUC de persona natural son válidos.
   *
   * Los coeficientes usados para verificar el décimo dígito de la cédula,
   * mediante el algoritmo “Módulo 10” son:  2. 1. 2. 1. 2. 1. 2. 1. 2
   *
   * Paso 1: Multiplicar cada dígito de los digitosIniciales por su respectivo
   * coeficiente.
   *
   *  Ejemplo
   *  digitosIniciales posicion 1  x 2
   *  digitosIniciales posicion 2  x 1
   *  digitosIniciales posicion 3  x 2
   *  digitosIniciales posicion 4  x 1
   *  digitosIniciales posicion 5  x 2
   *  digitosIniciales posicion 6  x 1
   *  digitosIniciales posicion 7  x 2
   *  digitosIniciales posicion 8  x 1
   *  digitosIniciales posicion 9  x 2
   *
   * Paso 2: Sí alguno de los resultados de cada multiplicación es mayor a o igual a 10,
   * se suma entre ambos dígitos de dicho resultado. Ex. 12->1+2->3
   *
   * Paso 3: Se suman los resultados y se obtiene total
   *
   * Paso 4: Divido total para 10, se guarda residuo. Se resta 10 menos el residuo.
   * El valor obtenido debe concordar con el digitoVerificador
   *
   * Nota: Cuando el residuo es cero(0) el dígito verificador debe ser 0.
   *
   * @param  string $digitosIniciales   Nueve primeros dígitos de CI/RUC
   * @param  string $digitoVerificador  Décimo dígito de CI/RUC
   *
   * @return boolean
   *
   * @throws exception Cuando los digitosIniciales no concuerdan contra
   * el código verificador.
   */
  private algoritmoModulo10(
    digitosInicialesInit: string,
    digitoVerificadorInit: string
  ) {
    const arrayCoeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const digitoVerificador = parseInt(digitoVerificadorInit);

    // 9 primeros digitos ????
    //$digitosIniciales = str_split($digitosIniciales);
    /// supongo que convertimos estring a un array
    const digitosIniciales = digitosInicialesInit.split('');

    let total = 0;
    digitosIniciales.forEach((value, key) => {
      let valorPosicion: number | string[] =
        parseInt(value) * arrayCoeficientes[key];

      if (valorPosicion >= 10) {
        valorPosicion = valorPosicion.toString().split('');
        valorPosicion = this.array_sum(valorPosicion);
        //valorPosicion = parseInt(valorPosicion);
      }

      total += valorPosicion;
    });

    const residuo = total % 10;
    let resultado = 0;
    if (residuo === 0) {
      resultado = 0;
    } else {
      resultado = 10 - residuo;
    }

    if (resultado !== digitoVerificador) {
      throw new Error('Dígitos iniciales no validan contra Dígito Idenficador');
    }

    return true;
  }

  /**
   * Algoritmo Modulo11 para validar RUC de sociedades privadas y públicas
   *
   * El código verificador es el decimo digito para RUC de empresas privadas
   * y el noveno dígito para RUC de empresas públicas
   *
   * Paso 1: Multiplicar cada dígito de los digitosIniciales por su respectivo
   * coeficiente.
   *
   * Para RUC privadas el coeficiente esta definido y se multiplica con las siguientes
   * posiciones del RUC:
   *
   *  Ejemplo
   *  digitosIniciales posicion 1  x 4
   *  digitosIniciales posicion 2  x 3
   *  digitosIniciales posicion 3  x 2
   *  digitosIniciales posicion 4  x 7
   *  digitosIniciales posicion 5  x 6
   *  digitosIniciales posicion 6  x 5
   *  digitosIniciales posicion 7  x 4
   *  digitosIniciales posicion 8  x 3
   *  digitosIniciales posicion 9  x 2
   *
   * Para RUC privadas el coeficiente esta definido y se multiplica con las siguientes
   * posiciones del RUC:
   *
   *  digitosIniciales posicion 1  x 3
   *  digitosIniciales posicion 2  x 2
   *  digitosIniciales posicion 3  x 7
   *  digitosIniciales posicion 4  x 6
   *  digitosIniciales posicion 5  x 5
   *  digitosIniciales posicion 6  x 4
   *  digitosIniciales posicion 7  x 3
   *  digitosIniciales posicion 8  x 2
   *
   * Paso 2: Se suman los resultados y se obtiene total
   *
   * Paso 3: Divido total para 11, se guarda residuo. Se resta 11 menos el residuo.
   * El valor obtenido debe concordar con el digitoVerificador
   *
   * Nota: Cuando el residuo es cero(0) el dígito verificador debe ser 0.
   *
   * @param  string $digitosIniciales   Nueve primeros dígitos de RUC
   * @param  string $digitoVerificador  Décimo dígito de RUC
   * @param  string $tipo Tipo de identificador
   *
   * @return boolean
   *
   * @throws exception Cuando los digitosIniciales no concuerdan contra
   * el código verificador.
   */
  private algoritmoModulo11 = (
    digitosInicialesInit: string,
    digitoVerificadorInit: string,
    tipo: string
  ) => {
    let arrayCoeficientes: number[] = [];
    switch (tipo) {
      case 'ruc_privada':
        arrayCoeficientes = [4, 3, 2, 7, 6, 5, 4, 3, 2];
        break;
      case 'ruc_publica':
        arrayCoeficientes = [3, 2, 7, 6, 5, 4, 3, 2];
        break;
      default:
        throw new Error('Tipo de Identificación no existe.');
    }

    const digitoVerificador = parseInt(digitoVerificadorInit);
    const digitosIniciales = digitosInicialesInit.split('');

    let total = 0;
    digitosIniciales.forEach((value, key) => {
      const valorPosicion = parseInt(value) * arrayCoeficientes[key];
      total += valorPosicion;
    });

    const residuo = total % 11;
    let resultado = 0;

    if (residuo === 0) {
      resultado = 0;
    } else {
      resultado = 11 - residuo;
    }

    if (resultado !== digitoVerificador) {
      throw new Error('Dígitos iniciales no validan contra Dígito Idenficador');
    }

    return true;
  };

  // eslint-disable-next-line camelcase
  private array_sum = (array: string[]): number => {
    //  discuss at: https://locutus.io/php/array_sum/
    // original by: Kevin van Zonneveld (https://kvz.io)
    // bugfixed by: Nate
    // bugfixed by: Gilbert
    // improved by: David Pilia (https://www.beteck.it/)
    // improved by: Brett Zamir (https://brett-zamir.me)
    //   example 1: array_sum([4, 9, 182.6])
    //   returns 1: 195.6
    //   example 2: var $total = []
    //   example 2: var $index = 0.1
    //   example 2: for (var $y = 0; $y < 12; $y++){ $total[$y] = $y + $index }
    //   example 2: array_sum($total)
    //   returns 2: 67.2

    let sum = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const key in array) {
      if (!isNaN(parseFloat(array[key]))) {
        sum += parseFloat(array[key]);
      }
    }
    return sum;
  };

  private isNumeric = (numero: any) => {
    const num: any = `${numero}`; //coerce num to be a string
    return !isNaN(num) && !isNaN(parseFloat(num));
  };

  /**
   * Get error
   *
   * @return string Mensaje de error
   */
  public getError() {
    return this.error;
  }

  /**
   * Set error
   *
   * @param  string $newError
   * @return object $this
   */
  public setError(newError: string) {
    this.error = newError;
    //return $this;
  }
}

export default ValidarIdentificacion;
