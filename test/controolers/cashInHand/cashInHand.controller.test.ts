import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import sinon from 'sinon';
import {app} from '../../../src/services/express'; // Import your Express app
import ICashInHandModel from '../../../src/models/cashInHand/cashInHand.model';
import { Status } from '.../../../src/types/type';
import { afterEach, beforeEach, describe, it } from 'node:test';

describe('Cash In Hand Controller', () => {
  let cashInHand: { cash: number; lastUpdatedBy: mongoose.Types.ObjectId };

  beforeEach(() => {
    cashInHand = {
      cash: 100,
      lastUpdatedBy: new mongoose.Types.ObjectId(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /api/cash-in-hand', () => {
    it('should create a new cash entry', async () => {
      const createStub = sinon.stub(ICashInHandModel.prototype, 'save').returns(cashInHand as any);
      
      const res = await request(app)
        .post('/api/cash-in-hand')
        .send({ cash: 100 })
        .set('userId', cashInHand.lastUpdatedBy.toString());

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(cashInHand);
      createStub.restore();
    });

    it('should return 500 if creation fails', async () => {
      sinon.stub(ICashInHandModel.prototype, 'save').throws(new Error('DB Error'));

      const res = await request(app)
        .post('/api/cash-in-hand')
        .send({ cash: 100 })
        .set('userId', cashInHand.lastUpdatedBy.toString());

      expect(res.status).to.equal(500);
      expect(res.body.error).to.equal('Failed to create cash entry');
    });
  });

  describe('GET /api/cash-in-hand', () => {
    it('should retrieve all cash entries', async () => {
      sinon.stub(ICashInHandModel, 'find').returns([cashInHand] as any);

      const res = await request(app).get('/api/cash-in-hand');

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal([cashInHand]);
    });

    it('should return 500 if fetching fails', async () => {
      sinon.stub(ICashInHandModel, 'find').throws(new Error('DB Error'));

      const res = await request(app).get('/api/cash-in-hand');

      expect(res.status).to.equal(500);
      expect(res.body.error).to.equal('Failed to fetch cash entries');
    });
  });

  describe('GET /api/cash-in-hand/:id', () => {
    it('should retrieve a cash entry by ID', async () => {
      sinon.stub(ICashInHandModel, 'findOne').returns(cashInHand as any);

      const res = await request(app).get(`/api/cash-in-hand/${cashInHand.lastUpdatedBy}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(cashInHand);
    });

    it('should return 404 if cash entry is not found', async () => {
      sinon.stub(ICashInHandModel, 'findOne').returns(cashInHand as any);

      const res = await request(app).get(`/api/cash-in-hand/${cashInHand.lastUpdatedBy}`);

      expect(res.status).to.equal(404);
      expect(res.body.error).to.equal('Cash entry not found');
    });

    it('should return 500 if fetching by ID fails', async () => {
      sinon.stub(ICashInHandModel, 'findOne').throws(new Error('DB Error'));

      const res = await request(app).get(`/api/cash-in-hand/${cashInHand.lastUpdatedBy}`);

      expect(res.status).to.equal(500);
      expect(res.body.error).to.equal('Failed to fetch cash entry');
    });
  });

  // describe('PUT /api/cash-in-hand/:id', () => {
  //   it('should update a cash entry', async () => {
  //     const updateStub = sinon.stub(ICashInHandModel, 'findByIdAndUpdate').returns(cashInHand as any);

  //     const res = await request(app)
  //       .put(`/api/cash-in-hand/${cashInHand.lastUpdatedBy}`)
  //       .send({ cash: 150 })
  //       .set('userId', cashInHand.lastUpdatedBy.toString());

  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.deep.equal(cashInHand);
  //     updateStub.restore();
  //   });

  //   it('should return 404 if cash entry is not found', async () => {
  //     sinon.stub(ICashInHandModel, 'findByIdAndUpdate').returns(null);

  //     const res = await request(app).put(`/api/cash-in-hand/${cashInHand.lastUpdatedBy}`).send({ cash: 150 });

  //     expect(res.status).to.equal(404);
  //     expect(res.body.error).to.equal('Cash entry not found');
  //   });

  //   it('should return 500 if updating fails', async () => {
  //     sinon.stub(ICashInHandModel, 'findByIdAndUpdate').throws(new Error('DB Error'));

  //     const res = await request(app).put(`/api/cash-in-hand/${cashInHand.lastUpdatedBy}`).send({ cash: 150 });

  //     expect(res.status).to.equal(500);
  //     expect(res.body.error).to.equal('Failed to update cash entry');
  //   });
  // });

  // describe('DELETE /api/cash-in-hand/:id', () => {
  //   it('should delete a cash entry', async () => {
  //     const deleteStub = sinon.stub(ICashInHandModel, 'findByIdAndUpdate').returns(cashInHand as any);

  //     const res = await request(app).delete(`/api/cash-in-hand/${cashInHand.lastUpdatedBy}`);

  //     expect(res.status).to.equal(200);
  //     expect(res.body.message).to.equal('Cash entry deleted successfully');
  //     deleteStub.restore();
  //   });

  //   it('should return 404 if cash entry is not found', async () => {
  //     sinon.stub(ICashInHandModel, 'findByIdAndUpdate').returns(null);

  //     const res = await request(app).delete(`/api/cash-in-hand/${cashInHand.lastUpdatedBy}`);

  //     expect(res.status).to.equal(404);
  //     expect(res.body.error).to.equal('Cash entry not found');
  //   });

  //   it('should return 500 if deleting fails', async () => {
  //     sinon.stub(ICashInHandModel, 'findByIdAndUpdate').throws(new Error('DB Error'));

  //     const res = await request(app).delete(`/api/cash-in-hand/${cashInHand.lastUpdatedBy}`);

  //     expect(res.status).to.equal(500);
  //     expect(res.body.error).to.equal('Failed to delete cash entry');
  //   });
  // });
});
