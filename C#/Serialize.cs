public static byte[] Serialize(object obj)
        {
            if (obj == null)
            {
                return default;
            }

            // generic type
            switch (obj)
            {
                case uint value: return BitConverter.GetBytes(value);
                case ushort value: return BitConverter.GetBytes(value);
                case float value: return BitConverter.GetBytes(value);
                case long value: return BitConverter.GetBytes(value);
                case ulong value: return BitConverter.GetBytes(value);
                case short value: return BitConverter.GetBytes(value);
                case double value: return BitConverter.GetBytes(value);
                case char value: return BitConverter.GetBytes(value);
                case bool value: return BitConverter.GetBytes(value);
                case int value: return BitConverter.GetBytes(value);

                case IBytes bytes: return bytes.Tobytes();
            }

            var type = obj.GetType();

            // struct
            if (type.IsValueType)
            {
                return StructToBuffer(obj);
            }


            throw new NotSupportedException();

            #region Obsolete
            ////Debug.Assert(obj.GetType().IsSerializable);
            //using (var stream = new MemoryStream())
            //{
            //    var formatter = new BinaryFormatter();
            //    try
            //    {
            //        formatter.Serialize(stream, obj);
            //        return stream.ToArray();
            //    }
            //    catch (SerializationException ex)
            //    {
            //        Log(ex);
            //        return null;
            //    }
            //}
            #endregion
        }

        public static bool Deserialize<T>(byte[] data, out T value)
        {
            if (data.IsCollectionNullOrEmpty())
            {
                value = default;
                return false;
            }

            var type = typeof(T);

            // generic type
            if (type == typeof(uint))
            {
                value = (T)(object)BitConverter.ToUInt32(data);
                return true;
            }
            if (type == typeof(ushort))
            {
                value = (T)(object)BitConverter.ToUInt16(data);
                return true;
            }
            if (type == typeof(float))
            {
                value = (T)(object)BitConverter.ToSingle(data);
                return true;
            }
            if (type == typeof(long))
            {
                value = (T)(object)BitConverter.ToInt64(data);
                return true;
            }
            if (type == typeof(ulong))
            {
                value = (T)(object)BitConverter.ToUInt64(data);
                return true;
            }
            if (type == typeof(short))
            {
                value = (T)(object)BitConverter.ToInt16(data);
                return true;
            }
            if (type == typeof(double))
            {
                value = (T)(object)BitConverter.ToDouble(data);
                return true;
            }
            if (type == typeof(char))
            {
                value = (T)(object)BitConverter.ToChar(data);
                return true;
            }
            if (type == typeof(bool))
            {
                value = (T)(object)BitConverter.ToBoolean(data);
                return true;
            }
            if (type == typeof(int))
            {
                value = (T)(object)BitConverter.ToInt32(data);
                return true;
            }

            // struct
            if (type.IsValueType)
            {
                return BytesToStrut(data, out value);
            }

            throw new NotSupportedException();

            #region Obsolete
            ////Debug.Assert(obj.GetType().IsSerializable);
            //using (var stream = new MemoryStream(data))
            //{
            //    var formatter = new BinaryFormatter();
            //    try
            //    {
            //        value = (T)formatter.Deserialize(stream);
            //        return true;
            //    }
            //    catch (SerializationException ex)
            //    {
            //        Log(ex);

            //        value = default;
            //        return false;
            //    }
            //}
            #endregion
        }