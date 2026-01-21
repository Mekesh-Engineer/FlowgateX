import axios from 'axios';

export const iotService = {
  async getDevices() {
    try {
      const response = await axios.get('/api/iot');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      throw error;
    }
  },

  async createDevice(deviceData: any) {
    try {
      const response = await axios.post('/api/iot', deviceData);
      return response.data;
    } catch (error) {
      console.error('Failed to create device:', error);
      throw error;
    }
  },

  async logData(deviceId: string, data: any) {
    try {
      const response = await axios.post(`/api/iot/${deviceId}/logs`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to log data:', error);
      throw error;
    }
  },
};
