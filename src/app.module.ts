import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ChildrenModule } from './modules/children/children.module';
import { TimelineModule } from './modules/timeline/timeline.module';

@Module({
  imports: [UserModule, ChildrenModule, TimelineModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
