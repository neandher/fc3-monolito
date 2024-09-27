import Address from "../../../@shared/domain/value-object/address";
import InvoiceItem from "../../domain/invoice-item.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  FindInvoiceUseCaseInputDto,
  FindInvoiceUseCaseOutputDto,
} from "./find-invoice.usecase.dto";

export default class FindInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository;
  }

  async execute(
    input: FindInvoiceUseCaseInputDto
  ): Promise<FindInvoiceUseCaseOutputDto> {
    const result = await this._invoiceRepository.find(input.id);

    return {
      id: result.id.id,
      name: result.name,
      document: result.document,
      address: new Address(
        result.address.street,
        result.address.number,
        result.address.complement,
        result.address.city,
        result.address.state,
        result.address.zipCode
      ),
      items: result.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: result.total(),
      createdAt: result.createdAt,
    };
  }
}
