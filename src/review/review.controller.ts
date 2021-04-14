import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { ReviewModel } from './review.model';
import { REVIEW_NOT_FOUND } from './review.constants';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { IdValidationPipe } from '../pipes/ad-validation.pipe';
import { TelegramService } from '../telegram/telegram.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly telegramService: TelegramService
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return await this.reviewService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('notify')
  async notify(@Body() dto: CreateReviewDto) {
    const message =
      `Имя: ${dto.name}\n` +
      `Заголовок: ${dto.title}\n` +
      `Описание: ${dto.description}\n` +
      `Идентификатор продукта: ${dto.productId}\n`;
    return await this.telegramService.sendMessage(message);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc: ReviewModel = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  // @UseGuards(JwtGuard)
  @Get('byProduct/:productId')
  async getByProductId(@Param('productId', IdValidationPipe) productId: string) {
    return await this.reviewService.findByProductId(productId);
  }
}
