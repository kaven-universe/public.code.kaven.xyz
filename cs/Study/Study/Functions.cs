using System.Diagnostics;

namespace Study
{
    public static partial class Functions
    {
        public static string BytesToBinaryString(byte[] byteArray)
        {
            // Use BitConverter to convert each byte to a 8-bit binary representation
            var binaryString = string.Join("", byteArray.Select(b => Convert.ToString(b, 2).PadLeft(8, '0')));

            return binaryString;
        }

        public static double BinaryStringToDouble(string value)
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
    }
}
