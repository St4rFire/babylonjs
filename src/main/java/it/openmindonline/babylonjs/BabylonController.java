package it.openmindonline.babylonjs;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.net.URL;
import java.util.Base64;
import java.util.Collection;
import java.util.List;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageTree;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.tools.imageio.ImageIOUtil;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;


@Controller
public class BabylonController
{
    @Autowired
    private ResourceLoader resourceLoader;


    @RequestMapping(path = {"/", "/spaceship"})
    public String spaceship(Model model) {
        return "spaceship";
    }

    @RequestMapping(path = {"/bag", "/meshCustomizer"})
    public String bag(Model model) {
        return "meshCustomizer";
    }

    @RequestMapping(value = "/downloadtexture")
    public void downloadOrder(@RequestParam(value="name") String name, HttpServletResponse response)
    {

        try (InputStream in = getClass().getResourceAsStream("/static/babylon/mesh/"+name+"/"+name+".png"))
        {
            response.setHeader("Content-Disposition", "attachment; filename=" + name + ".png");
            response.setContentType("image/png");
            ServletOutputStream outputStream = response.getOutputStream();
            IOUtils.copy(in, outputStream);
            IOUtils.closeQuietly(outputStream);
            IOUtils.closeQuietly(in);
        }
        catch (Exception e)
        {
            //log.error("Error exporting order {}", orderNumber, e);
        }
    }



    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {

        Resource file = resourceLoader.getResource("classpath:/static/babylon/mesh/" + filename + "/" + filename + ".png");
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }


    @RequestMapping(value = "/uploadPdf")
    public void uploadPdf(@RequestParam("pdf") MultipartFile file, HttpServletResponse response)
    {
        try
        {
            convertPdfToPng(response, file.getInputStream());
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/convertPdfToPng")
    public void convertPdfToPng(HttpServletResponse response)
    {
        InputStream resourceAsStream = getClass().getResourceAsStream("/static/babylon/mesh/test/vale.pdf");
        convertPdfToPng(response, resourceAsStream);
    }

    private void convertPdfToPng(HttpServletResponse response, InputStream pdf)
    {
        try (InputStream in = pdf)
        {

            // load pdf
            PDDocument pdDocument = PDDocument.load(in);
            if (pdDocument.getNumberOfPages() > 0)
            {
                // crop page
                PDPage page = pdDocument.getPage(0);
                PDRectangle bBox = page.getBBox();
                final float width = bBox.getWidth();
                final float height = bBox.getHeight();

                bBox.setLowerLeftX(58);
                bBox.setLowerLeftY(42);
                bBox.setUpperRightX(width - 40);
                bBox.setUpperRightY(height - 80);
                page.setCropBox(bBox);


                // reder page
                PDFRenderer pdfRenderer = new PDFRenderer(pdDocument);
                BufferedImage bim = pdfRenderer.renderImageWithDPI(0, 60, ImageType.RGB);

                // write to file
//                File imageFile = new File( "aaa" + ".png" );
//                FileOutputStream fos = new FileOutputStream(imageFile);
//                ImageIOUtil.writeImage(bim, "png", fos, 300);

                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                ImageIOUtil.writeImage(bim, "png",  byteArrayOutputStream, 300);
                String s = Base64.getEncoder().encodeToString(byteArrayOutputStream.toByteArray());


                final PrintStream printStream = new PrintStream(response.getOutputStream());
                printStream.print(s);
                printStream.close();

                // write to response
//                ImageIOUtil.writeImage(bim, "png",  response.getOutputStream(), 300);
                response.setHeader("Content-Disposition", "attachment; filename=" + "test.png");
                response.setContentType("image/png");

                IOUtils.closeQuietly(response.getOutputStream());
                IOUtils.closeQuietly(in);
            }
            pdDocument.close();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }


}
