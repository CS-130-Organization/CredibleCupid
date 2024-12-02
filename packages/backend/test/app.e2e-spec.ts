import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from "typeorm";

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', async () => {
    for (let i = 0; i < 3; i++) {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: `female{i}@gmail.com`, password: 'password' });
    }

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@gmail.com', password: 'password' });
    
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@gmail.com', password: 'wrong_password' })
      .expect(401);
    
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@gmail.com', password: 'password' })
      .expect(201);
  });

  it('/user/update_bio/ (POST)', async () => {
    let response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@gmail.com', password: 'password' })
      .expect(201);

    const jwt  = response.body.jwt;
    const guid = response.body.user_guid;

    const twenty_yrs_in_ms = 20 * 365.25 * 24 * 60 * 60 * 1000;
    const age_ms = Date.now() - twenty_yrs_in_ms;


    await request(app.getHttpServer())
      .post('/user/update_bio')
      .auth(jwt, { type: 'bearer' })
      .send({ 
        first_name: "First",
        last_name: "Last",
        bio: "Test",
        gender: "Female",
        pronouns: "She/Her",
        sexual_orientation: "Straight",
        birthday_ms_since_epoch: age_ms,
        height_mm: 1625,
        occupation: "Test",
        credibility_score: 100
      })
      .expect(201);

    response = await request(app.getHttpServer())
      .get(`/user/${guid}/query`)
      .expect(200);
    
    expect(response.body.first_name).toBe("First");
    expect(response.body.last_name).toBe("Last");
  });

  it('/user/update_bio/ (POST) (Prevent Male without Referral)', async () => {
    let response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@gmail.com', password: 'password' })
      .expect(201);

    const jwt  = response.body.jwt;
    const guid = response.body.user_guid;

    const twenty_yrs_in_ms = 20 * 365.25 * 24 * 60 * 60 * 1000;
    const age_ms = Date.now() - twenty_yrs_in_ms;


    await request(app.getHttpServer())
      .post('/user/update_bio')
      .auth(jwt, { type: 'bearer' })
      .send({ 
        first_name: "First",
        last_name: "Last",
        bio: "Test",
        gender: "Male",
        pronouns: "He/Him",
        sexual_orientation: "Straight",
        birthday_ms_since_epoch: age_ms,
        height_mm: 1625,
        occupation: "Test",
        credibility_score: 100
      })
      .expect(403);
  });

  it('/user/update_bio/ (POST) (Prevent Male without Referral)', async () => {
    let response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@gmail.com', password: 'password' })
      .expect(201);

    const jwt  = response.body.jwt;
    const guid = response.body.user_guid;

    const twenty_yrs_in_ms = 20 * 365.25 * 24 * 60 * 60 * 1000;
    const age_ms = Date.now() - twenty_yrs_in_ms;


    await request(app.getHttpServer())
      .post('/user/update_bio')
      .auth(jwt, { type: 'bearer' })
      .send({ 
        first_name: "First",
        last_name: "Last",
        bio: "Test",
        gender: "Male",
        pronouns: "He/Him",
        sexual_orientation: "Straight",
        birthday_ms_since_epoch: age_ms,
        height_mm: 1625,
        occupation: "Test",
        credibility_score: 100
      })
      .expect(403);
  });

  afterAll(async () => {
    await app.close();
  });
});
