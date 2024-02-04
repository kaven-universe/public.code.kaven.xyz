using System.Diagnostics;

namespace Study
{
    public class FloatingPoint
    {
        private static void Assert()
        {
            var v = Math.Pow(2, 24);

            var f = Convert.ToSingle(v);

            Debug.Assert(f == v);

            Debug.Assert(f - 1 == v - 1);
            Debug.Assert(f + 1 != v + 1);

            var i = 10;
            while (i-- > 0)
            {
                Debug.WriteLine(f++);
            }

            i = 10;
            while (i-- > 0)
            {
                Debug.WriteLine(f--);
            }
        }

        private static string GenerateMarkdownTable(byte[] byteArray)
        {
            // Header row
            var table = "| Byte |";
            for (var i = 0; i < byteArray.Length; i++)
            {
                table += $" Byte {i + 1} |";
            }
            table += "\n|-------|";
            for (var i = 0; i < byteArray.Length; i++)
            {
                table += "--------|";
            }

            // Hex row
            table += "\n| Hex   |";
            foreach (var byteValue in byteArray)
            {
                table += $" 0x{byteValue:X2} |";
            }

            // Decimal row
            table += "\n| Dec   |";
            foreach (var byteValue in byteArray)
            {
                table += $" {byteValue} |";
            }

            // Binary row
            table += "\n| Bin   |";
            foreach (var byteValue in byteArray)
            {
                table += $" {Convert.ToString(byteValue, 2).PadLeft(8, '0')} |";
            }

            return table;
        }

        private static string BuildRow(params string[] cells)
        {
            var row = "| " + string.Join(" | ", cells) + " |";
            return row;
        }

        private static string MoveDot(string value, int offset)
        {
            if (offset == 0)
            {
                return value;
            }

            string left;
            string right;

            var dotIndex = value.IndexOf('.');
            if (dotIndex != -1)
            {
                if (value.Count(p => p == '.') != 1)
                {
                    throw new Exception();
                }

                left = value[..dotIndex];
                right = value[(dotIndex + 1)..];
            }
            else
            {
                left = value;
                right = string.Empty;
            }

            var abs = Math.Abs(offset);
            if (offset < 0)
            {
                while (left.Length - 1 < abs)
                {
                    left = "0" + left;
                }

                left = left.Insert(left.Length - abs, ".");
            }
            else
            {
                while (right.Length < abs)
                {
                    right += "0";
                }

                right = right.Insert(abs, ".");
            }

            var result = left + right;

            //if (result.Contains('.'))
            //{
            //    result = result.TrimEnd('0').TrimEnd('.');
            //}

            return result;
        }

        private static double BinaryToDouble(string value)
        {
            var dotIndex = value.IndexOf('.');
            var power = (dotIndex != -1 ? dotIndex : value.Length) - 1;

            var result = 0d;
            foreach (var item in value)
            {
                if (item == '.')
                {
                    Trace.Assert(power == -1);
                    continue;
                }

                result += (item == '0' ? 0 : 1) * Math.Pow(2, power);
                power--;
            }

            return result;
        }

        private static string GenerateTable(double[] values, string[]? descriptions = null, bool sem = true)
        {
            var columns = new List<string>();
            if (descriptions != null)
            {
                columns.Add("Number");
            }

            if (sem)
            {
                columns.Add("Sign (s, 1 bit)");
                columns.Add("Stored exponent (e, 11 bits)");
                columns.Add("Mantissa (m, 52 bits)");
                columns.Add("Exact decimal representation");
            }
            else
            {
                columns.Add("$(-1)^s * 1.m_{(2)} * 2^{e-1023}$");
                //columns.Add(string.Empty);

                columns.Add("Value");
            }

            var header = BuildRow([.. columns]);
            var rows = new List<string>()
            {
                header,
                string.Join(" -- ", Enumerable.Repeat('|', header.Count(p => p == '|'))),
            };

            (string s, string e, string m) extract1(double value)
            {
                var bin = Functions.ByteArrayToBinaryString(BitConverter.GetBytes(value).Reverse().ToArray());
                var s = bin[..1];
                var e = bin.Substring(1, 11);
                var m = bin[12..];

                return (s, e, m);
            }

            (string s, string e, string m) extract2(double value)
            {
                // Get the binary representation of the double
                var bits = BitConverter.DoubleToInt64Bits(value);

                // Extract the sign, exponent, and mantissa
                var sign = (int)((bits >> 63) & 1);
                var exponent = (int)((bits >> 52) & 0x7FF);
                var mantissa = bits & 0xFFFFFFFFFFFFF;

                var s = sign > 0 ? "1" : "0";
                var e = exponent.ToString("b").PadLeft(11, '0');
                var m = mantissa.ToString("b").PadLeft(52, '0');

                return (s, e, m);
            }

            (string s, string e, string m) extract3(double value)
            {
                // Get the bytes of the double
                var bytes = BitConverter.GetBytes(value);

                // Extract the sign, exponent, and mantissa
                var sign = (bytes[7] >> 7) & 1;
                var exponent = ((bytes[7] & 0x7F) << 4) | ((bytes[6] >> 4) & 0xF);
                var mantissa = BitConverter.ToUInt64(bytes, 0) & 0x000FFFFFFFFFFFFF;

                var s = sign > 0 ? "1" : "0";
                var e = exponent.ToString("b").PadLeft(11, '0');
                var m = mantissa.ToString("b").PadLeft(52, '0');

                return (s, e, m);
            }

            for (var i = 0; i < values.Length; i++)
            {
                var value = values[i];

                var v1 = extract1(value);
                var v2 = extract2(value);
                var v3 = extract3(value);

                if (v1 != v2 || v2 != v3)
                {
                    throw new Exception();
                }

                var (s, e, m) = v1;

                Trace.Assert(e.Length == 11);
                Trace.Assert(m.Length == 52);

                var cells = new List<string>();
                if (descriptions != null)
                {
                    cells.Add(descriptions[i]);
                }

                if (sem)
                {
                    cells.Add(s);
                    cells.Add(e);
                    cells.Add(m);
                    cells.Add(Functions.ToExactString(value));
                }
                else
                {
                    cells.Add($"$(-1)^{s} * 1.{m}_{{(2)}} * 2^{{{Convert.ToUInt64(e, 2)} - 1023}}$");

                    var sign = Math.Pow(-1, s == "0" ? 0 : 1);

                    var offset = Convert.ToInt32(e, 2) - 1023;
                    var binStr = MoveDot($"1.{m}", offset);
                    //cells.Add($"${sign} * {binStr}_{{(2)}}$");

                    cells.Add($"{sign * BinaryToDouble(binStr)}");
                }

                var row = "| " + string.Join(" | ", cells) + " |";

                rows.Add(row);
            }

            return string.Join(Environment.NewLine, rows);
        }

        public static void Run()
        {
            //Assert();

            //var d1 = 46.42829231507700882275457843206822872161865234375;
            //var d2 = Math.Pow(2, 24);

            //var s = Functions.ToExactString(d);
            //var t1 = GenerateMarkdownTable(BitConverter.GetBytes(d));

            double[] values = [
                1 / 3d,
                Math.Sqrt(2),
                Math.PI,
                Math.E,
                46.42829231507700882275457843206822872161865234375d,
                Math.Pow(2, 24),
                0.1d,
                0.01d,
                123.456d,
                1d,
                -1d,
                0d,
            ];

            string[] descriptions = [
                @"$\frac{1}{3}$",
                @"$\sqrt2$",
                "π",
                "e",
                "46.42829231507700882275457843206822872161865234375",
                "$2^{24}$",
                "0.1",
                "0.01",
                "123.456",
                "1",
                "-1",
                "0",
            ];

            var t2 = GenerateTable(values, descriptions, true);
            var t3 = GenerateTable(values, descriptions, false);

            var table = t2 + Environment.NewLine + Environment.NewLine + t3;
        }
    }
}
