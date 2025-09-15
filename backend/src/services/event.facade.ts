import { AppDataSource } from '../config/data-source';
import { CreateEventInput } from '../validators/event.validate';

class EventFacade {
  async createFullEvent( data: CreateEventInput) {
    return await AppDataSource.transaction(async (manager) => {
      // dùng transaction để tạo nhiều dữ liệu có liên quan đến nhau => nếu tạo lỗi 1 tài nguyên thì sẽ không có dữ liệu nào được tạo
      // 1. Tạo Organizer hoặc Update
      // dùng service để gọi

      // 2. Tạo Email Setting

      // 3. Tạo địa điểm mới

      // 4. Tạo Event (gắn organizer + địa điểm)

      // 5. Tạo hạng vé

      // 6. lưu thêm thông tin payment

      // lưu thay đổi 
    });
  }
}

export default new EventFacade(); 