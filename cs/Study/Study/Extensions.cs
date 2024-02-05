using System.Text;

namespace Study
{
    public static class Extensions
    {
        public static string AddSeparators(this string @this, int chunkSize, string separator)
        {
            if (chunkSize <= 0)
            {
                throw new ArgumentException("Chunk size should be greater than zero.");
            }

            var sb = new StringBuilder();
            var i = 0;
            foreach (var c in @this)
            {
                sb.Append(c);
                i++;

                if (i % chunkSize == 0)
                {
                    sb.Append(separator);
                }
            }

            return sb.ToString();
        }

        public static string AddSpaces(this string @this, int chunkSize = 4)
        {
            return @this.AddSeparators(chunkSize, " ");
        }
    }
}
