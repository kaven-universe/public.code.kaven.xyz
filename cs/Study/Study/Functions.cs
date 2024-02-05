using System.Diagnostics;
using System.Numerics;
using System.Text;

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

        public static Fraction BinaryStringToFraction(string value)
        {
            var dotIndex = value.IndexOf('.');
            var power = (dotIndex != -1 ? dotIndex : value.Length) - 1;

            var result = new Fraction(0);
            foreach (var item in value)
            {
                if (item == '.')
                {
                    Trace.Assert(power == -1);
                    continue;
                }

                if (item == '1')
                {
                    var f = Fraction.FromPow(2, power);
                    result += f;
                }

                power--;
            }

            return result;
        }

        /// <summary>
        /// least common multiple
        /// </summary>
        /// <param name="a"></param>
        /// <param name="b"></param>
        /// <returns></returns>
        public static ulong LCM(ulong a, ulong b)
        {
            ulong num1, num2;

            if (a > b)
            {
                num1 = a;
                num2 = b;
            }
            else
            {
                num1 = b;
                num2 = a;
            }

            for (ulong i = 1; i <= num2; i++)
            {
                if ((num1 * i) % num2 == 0)
                {
                    return i * num1;
                }
            }

            return num2;
        }

        /// <summary>
        /// greatest common divisor
        /// </summary>
        /// <param name="a"></param>
        /// <param name="b"></param>
        /// <returns></returns>
        public static ulong GCD(ulong a, ulong b)
        {
            while (b != 0)
            {
                var temp = b;
                b = a % b;
                a = temp;
            }

            return a;
        }

        public static BigInteger LCM(BigInteger a, BigInteger b)
        {
            if (a == 0 || b == 0)
            {
                return 0;
            }

            var gcd = GCD(a, b);

            // LCM(a, b) = |a * b| / GCD(a, b)
            var lcm = BigInteger.Abs(a * b) / gcd;

            return lcm;
        }

        public static BigInteger GCD(BigInteger a, BigInteger b)
        {
            while (b != 0)
            {
                var temp = b;
                b = a % b;
                a = temp;
            }

            return BigInteger.Abs(a);
        }

        public static string Divide(BigInteger dividend, BigInteger divisor, int precision)
        {
            if (divisor.IsZero)
            {
                return "Error: Division by zero";
            }

            BigInteger quotient;

            quotient = BigInteger.DivRem(dividend, divisor, out var remainder);

            var result = new StringBuilder(quotient.ToString());

            if (remainder > 0)
            {
                result.Append('.');

                // Keep track of the remainder and add decimal places
                for (var i = 0; i < precision; i++)
                {
                    remainder *= 10;
                    var nextDigit = BigInteger.DivRem(remainder, divisor, out remainder);
                    result.Append(nextDigit.ToString());

                    if (remainder == 0)
                    {
                        break;
                    }
                }
            }

            return result.ToString();
        }
    }
}
