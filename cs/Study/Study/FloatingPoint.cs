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

        private static string MoveDot(string binaryString, int offset)
        {
            // Find the position of the dot in the original binary string
            var dotPosition = binaryString.IndexOf('.');

            // If the dot is not present, assume it's at the end of the string
            if (dotPosition == -1)
            {
                dotPosition = binaryString.Length;
            }

            // Calculate the new dot position after the offset
            var newDotPosition = dotPosition + offset;

            // Ensure the new dot position is within the bounds of the string
            if (newDotPosition < 0)
            {
                return "0." + string.Join(string.Empty, Enumerable.Repeat("0", Math.Abs(newDotPosition))) + binaryString.Replace(".", string.Empty);
            }
            else if (newDotPosition >= binaryString.Length)
            {
                return binaryString.Replace(".", string.Empty) + string.Join(string.Empty, Enumerable.Repeat("0", newDotPosition - binaryString.Length));
            }

            // Insert the dot at the new position
            var shiftedBinaryString = binaryString.Insert(newDotPosition, ".");

            // Remove the dot from the old position
            shiftedBinaryString = shiftedBinaryString.Remove(dotPosition + (newDotPosition > dotPosition ? 1 : 0), 1);

            // If moving to the left and the new dot position is before the start, add leading zeros
            if (newDotPosition < dotPosition)
            {
                var leadingZeros = dotPosition - newDotPosition;
                shiftedBinaryString = shiftedBinaryString.Insert(0, new string('0', leadingZeros));
            }

            // If moving to the right and the new dot position is after the end, add trailing zeros
            if (newDotPosition > dotPosition)
            {
                var trailingZeros = newDotPosition - dotPosition;
                shiftedBinaryString = shiftedBinaryString.PadRight(shiftedBinaryString.Length + trailingZeros, '0');
            }

            return shiftedBinaryString;
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
                columns.Add("Value");
                columns.Add("$(-1)^s * 1.m_{(2)} * 2^{e-1023}$");
                columns.Add(string.Empty);
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

                    var offset = Convert.ToInt32(e, 2) - 1023;
                    var binStr = MoveDot($"1.{m}", offset);
                    //cells.Add($"${Math.Pow(-1, Convert.ToInt32(s, 2))} * {binStr}_{{(2)}}$");

                    cells.Add($"${Math.Pow(-1, Convert.ToInt32(s, 2))} * {binStr}$");

                    cells.Add($"{value}");
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
