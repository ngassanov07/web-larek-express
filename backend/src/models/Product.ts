import mongoose from 'mongoose';

// title — название товара, строка от 2 до 30 символов,
// обязательное поле, уникальное.
// image — путь до файла и метаинформация об изображении,
// объект вида { fileName: string, originalName: string; }, обязательно поле.
// category — категория товара, строка, обязательное поле.
// description — описание товара, строка, необязательное поле.
// price — цена товара, число, необязательное поле, по умолчанию null.

interface IProduct {
  title: string
  image: {
    fileName: string
    originalName: string
  }
  category: string
  description?: string
  price?: number | null
}

const imageSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: [true, 'Image file name is required'],
  },
  originalName: {
    type: String,
    required: [true, 'Image original name is required'],
  },
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: [2, 'Title must be at least 2 characters'],
    maxLength: [30, 'Title must be at most 30 characters'],
    required: [true, 'Title is required'],
    unique: true,
  },
  image: {
    type: imageSchema,
    required: [true, 'Image is required'],
  },
  category: {
    type: String,
    enum: {
      values: ['софт-скил', 'хард-скил', 'другое', 'дополнительное', 'кнопка'],
      message: 'Category must be a valid product category',
    },
    required: [true, 'Category is required'],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IProduct>('product', productSchema);
