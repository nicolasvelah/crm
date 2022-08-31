export interface DeliveryData {
  vehicleRegistration: {
    status: string;
    plate: string | null;
  };

  vehicleRequest: {
    status: string;
    deliveryReceipt: string | null;
  };
  preDelivery: {
    status: 'Pendiente' | 'Completado';
    receipt: string | null;
  };

  scheduleDelivery: {
    status: 'Inactivo' | 'Pendiente' | 'Completado';
    schedule: {
      date: Date;
      where: 'En Showroom' | 'A domicilio';
    } | null;
  };

  delivery: {
    status: 'Inactivo' | 'Pendiente' | 'Entregado';
    receipt: string | null;
  };
  verificationDocuments: { url: string; name: string }[];
}
