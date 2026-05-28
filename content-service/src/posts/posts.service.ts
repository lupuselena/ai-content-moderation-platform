import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {

  constructor(
    private prisma: PrismaService
  ) {}

  async create(createPostDto: { text: string }) {

    const moderationResponse = await axios.post(
       process.env.MODERATION_SERVICE_URL!,
      {
        text: createPostDto.text,
      },
    );

    const moderationStatus = moderationResponse.data.status;

    const post = await this.prisma.post.create({
      data: {
        text: createPostDto.text,
        moderationStatus,
      },
    });

    return post;
  }

  async findAll() {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.post.findUnique({
      where: {
        id,
      },
    });
  }

 update(id: number, updatePostDto: any) {
    return {
      message: 'Update not implemented',
    };
  }

  remove(id: number) {
    return {
      message: 'Delete not implemented',
    };
  }
}