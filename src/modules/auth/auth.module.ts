import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: 'jfdklsaj-jfkdlas-fjdklas',
        signOptions: {
          expiresIn: '3600s', // 1 hour
        },
      }),
    }),
    //production
    // JwtModule.registerAsync({
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get<string>('JWT_SECRET'), // Access JWT_SECRET from environment
    //     signOptions: {
    //       expiresIn: configService.get<string>('JWT_EXPIRY'), // Access JWT_EXPIRY from environment
    //     },
    //   }),
    //   inject: [ConfigService], // Inject ConfigService here
    // }),
  ],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
