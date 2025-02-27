import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "./invoice-item.entity";

type InvoiceProps = {
  id?: Id;
  name: string;
  document: string;
  address: Address;
  items: InvoiceItem[];
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _items: InvoiceItem[];
  private _address: Address;

  constructor(props: InvoiceProps) {
    super(props.id, props.createdAt, props.updatedAt);

    this._name = props.name;
    this._document = props.document;
    this._items = props.items;
    this._address = props.address;
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get items(): InvoiceItem[] {
    return this._items;
  }

  get address(): Address {
    return this._address;
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.price, 0);
  }
}
