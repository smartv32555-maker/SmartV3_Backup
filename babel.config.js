module.exports = function(api) {
  api.cache(true);
  return {
    // 1. เปลี่ยนไปใช้ preset มาตรฐานของ React Native CLI เพื่อแก้ปัญหา Loose Mode Error
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      // 2. Module resolver: ยังคงไว้เพื่อรองรับ alias เช่น "@/..."
      [
        'module-resolver',
        {
          alias: {
            '@/': './', 
          },
        },
      ],
      // 3. (ถ้ามีการใช้) Reanimated Plugin ให้เพิ่มตรงนี้หลังจากการแก้ปัญหา Loose Mode เสร็จ
      // 'react-native-reanimated/plugin',
    ],
  };
};
