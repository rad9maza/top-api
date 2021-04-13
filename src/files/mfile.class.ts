export class Mfile {
  buffer: Buffer;
  originalname: string;

  constructor(file: Express.Multer.File | Mfile) {
    this.buffer = file.buffer;
    this.originalname = file.originalname;
  }
}
