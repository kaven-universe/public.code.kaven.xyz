namespace Study
{
    public static partial class Functions
    {
        public static string ByteArrayToBinaryString(byte[] byteArray)
        {
            // Use BitConverter to convert each byte to a 8-bit binary representation
            var binaryString = string.Join("", byteArray.Select(b => Convert.ToString(b, 2).PadLeft(8, '0')));

            return binaryString;
        }
    }
}
