import { Resolver, Query, ObjectType, Field, InputType, Args, Int } from '@nestjs/graphql';
import { AppService } from './app.service';

@ObjectType()
class PresignedUploadPayload {
  @Field(_type => String)
  fileId: string
  @Field(_type => String)
  url: string
  @Field(_type => [AwsS3UploadDataField])
  fields: AwsS3UploadDataField[]
}

@ObjectType()
class AwsS3UploadDataField {
  @Field(_type => String)
  key: string
  @Field(_type => String)
  value: string
}

@ObjectType()
class PresignedImageAssetPayload {
  @Field(_type => String)
  url: string
}

@InputType()
class AccessImageByKeyInput {
  @Field(_type => String)
  key: string
}

@InputType()
class AwsS3UploadOptions {
  @Field(_type => String)
  type: string
  @Field(_type => Int)
  size: number
  @Field(_type => String)
  fileName: string
  @Field(_type => String)
  fileId: string
}

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) { }

  @Query(_returns => PresignedImageAssetPayload)
  presignedImageAccess(@Args('input') input: AccessImageByKeyInput) {
    return this.appService.getSignedImageAccessUrl(input.key, {})
  }

  @Query(_returns => PresignedUploadPayload)
  presignedUpload(@Args('input') input: AwsS3UploadOptions) {
    return this.appService.generateSignedUploadUrl(input)
  }
}
