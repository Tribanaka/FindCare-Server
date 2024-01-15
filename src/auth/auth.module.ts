import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PractitionersModule } from 'src/practitioners/practitioners.module';

@Module({
  imports: [
    UsersModule,
    PractitionersModule,
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SESCRET}`,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
