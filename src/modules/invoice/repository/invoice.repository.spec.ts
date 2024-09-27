import { Sequelize } from "sequelize-typescript";

import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceItemModel from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";

describe("Invoice Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate a invoice", async () => {
    const invoice = new Invoice({
      name: "Invoice 1",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      items: [new InvoiceItem({ name: "Item 1", price: 100 })],
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoice.id.id },
      include: [InvoiceItemModel],
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toEqual(invoice.id.id);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.document).toEqual(invoice.document);

    expect(invoiceDb.items).toHaveLength(1);
    expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name);
    expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price);

    expect(invoiceDb.street).toEqual(invoice.address.street);
    expect(invoiceDb.number).toEqual(invoice.address.number);
    expect(invoiceDb.complement).toEqual(invoice.address.complement);
    expect(invoiceDb.city).toEqual(invoice.address.city);
    expect(invoiceDb.state).toEqual(invoice.address.state);
    expect(invoiceDb.zipcode).toEqual(invoice.address.zipCode);
    expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt);
    expect(invoiceDb.updatedAt).toStrictEqual(invoice.updatedAt);
  });

  it("should find a invoice", async () => {
    const invoice = new Invoice({
      name: "Invoice 1",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      items: [new InvoiceItem({ name: "Item 1", price: 100 })],
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const result = await repository.find(invoice.id.id);

    expect(result.id.id).toEqual(invoice.id.id);
    expect(result.name).toEqual(invoice.name);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);

    expect(result.address.street).toEqual(invoice.address.street);
    expect(result.address.number).toEqual(invoice.address.number);
    expect(result.address.complement).toEqual(invoice.address.complement);
    expect(result.address.city).toEqual(invoice.address.city);
    expect(result.address.state).toEqual(invoice.address.state);
    expect(result.address.zipCode).toEqual(invoice.address.zipCode);

    expect(result.createdAt).toStrictEqual(invoice.createdAt);
    expect(result.updatedAt).toStrictEqual(invoice.updatedAt);
  });
});
