import Base3DEntity from "@/common/entity/base.entity";
import {BuyableInterface} from "@/common/interfaces/buyable.interface";

export default abstract class AbstractDebris extends Base3DEntity implements BuyableInterface {
    abstract price: number;
    abstract isOpen: boolean;
}