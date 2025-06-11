import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.ts";

interface ProductAttributes {
    id: number;
    name: string;
    price: number;
    description: string;
    stock: number;
}

type ProductCreationAttributes = Omit<ProductAttributes, 'id'>;

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public name!: string;
    public price!: number;
    public description!: string;
    public stock!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Product.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'products'
});

export default Product;